require("dotenv").config();

const express = require("express");
const router = express.Router();
const axios = require("axios");

const constants = require("./constants");
const dbAPI = require("./dbAPI");

const token = process.env.SLACK_TOKEN;

//
// slackのチャンネルにいるBotでないメンバーをユーザーとして，割勘セッションの開始
//
router.post("/startSlackSession", async function (req, res) {
  const sessionName = "slack_" + req.body.team_domain + req.body.channel_id;
  try {
    const isDuplicated = await checkSessionName(sessionName);
    if (isDuplicated) {
      let data = {
        response_type: "in_channel",
        text:
          "すでにセッションが登録されています（ " +
          constants.appURL +
          "?sessionName=" +
          sessionName +
          " ）",
      };
      res.json(data);
      return;
    }
    const chMembersIdList = await getChMembersIdList(req.body.channel_id);
    const chMembersNameList = await makeUserNameList(chMembersIdList);
    const result = await makeWarikanSession(sessionName, chMembersNameList);

    if (result === constants.error) {
      let data = {
        text: "エラーが発生しました",
      };
      res.json(data);
      return;
    }
    let data = {
      response_type: "in_channel",
      text:
        "割勘のセッションを開始しました（ " +
        constants.appURL +
        "?sessionName=" +
        sessionName +
        " ）",
    };
    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

//
// 指定されたユーザーに，指定された金額の支払いを記録
//
router.post("/slackPayment", async function (req, res) {
  const sessionName = "slack_" + req.body.team_domain + req.body.channel_id;
  try {
    const isDuplicated = await checkSessionName(sessionName);
    if (!isDuplicated) {
      let data = {
        response_type: "in_channel",
        text:
          'セッションが登録されていません．まずは "/waristart"を実行してください' +
          "（チャンネル内のユーザー（Botを除く）でセッションが開始されます）",
      };
      res.json(data);
      return;
    }

    const texts = req.body.text.split(" ");
    const payment = texts[1];
    const payerNameAt = texts[0].split("@");
    let payerName = "";
    for (let ati = 1; ati < payerNameAt.length; ati++) {
      payerName += payerNameAt[ati];
    }

    const resisterSuccess = await resisterPayment(
      sessionName,
      payerName,
      payment
    );
    let data;
    if (resisterSuccess) {
      leastPaymentUserName = await whoPaysLeast(sessionName);
      data = {
        response_type: "in_channel",
        text:
          "現段階で最も少ない支払いなのは @" +
          leastPaymentUserName.trim() +
          " さんです．",
      };
    } else {
      data = {
        text: "支払いの登録に失敗しました",
      };
    }
    res.json(data);
  } catch (e) {
    const data = { text: "エラーが発生しました．引数を確認してください．" };
    res.json(data);
    console.log(e);
  }
});

async function whoPaysLeast(sessionName) {
  const client = dbAPI.clientConnect();
  const sessionInfo = await dbAPI.getSessionInfo(client, sessionName);

  const minPayment = Math.min(...sessionInfo.paymentList);
  const leastIndex = sessionInfo.paymentList.indexOf(minPayment);
  const leastPaymentUserName = sessionInfo.userNameList[leastIndex];
  return leastPaymentUserName;
}

async function getChMembersIdList(channelId) {
  const params = {
    channel: channelId,
    pretty: 1,
  };
  const axiosConfigChMembers = {
    method: "get",
    url: "https://slack.com/api/conversations.members",
    params: params,
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  let channelUserIdList = [];
  await axios(axiosConfigChMembers)
    .then(function (response) {
      channelUserIdList = response.data.members;
    })
    .catch(function (error) {
      console.log(error);
    });
  return channelUserIdList;
}

//
// 入力：ユーザーIDのリスト
// 出力：ボットではないユーザーのユーザー名のリスト
//
async function makeUserNameList(userIdList) {
  let userNameList = [];
  let getUserInfoPromiseList = [];
  for (let ui = 0; ui < userIdList.length; ui++) {
    const params = {
      user: userIdList[ui],
      pretty: 1,
    };
    axiosConfigUserInfo = {
      method: "get",
      url: "https://slack.com/api/users.info",
      params: params,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    getUserInfoPromiseList.push(axios(axiosConfigUserInfo));
  }
  await Promise.all(getUserInfoPromiseList)
    .then(function (values) {
      for (let vi = 0; vi < values.length; vi++) {
        if (!values[vi].data.ok) {
          continue;
        }
        if (!values[vi].data.user.is_bot) {
          userNameList.push(values[vi].data.user.name);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  return userNameList;
}

//
// 入力：登録するセッションネーム
// 出力：成功(success)か否(error)か
//
async function makeWarikanSession(sessionName, chMembersNameList) {
  let result;
  client = dbAPI.clientConnect();
  await dbAPI
    .initSession(
      client,
      sessionName,
      constants.throughPassword,
      chMembersNameList,
      new Array(chMembersNameList.length).fill(0)
    )
    .then(function (response) {
      console.log(response);
      result = constants.success;
    })
    .catch(function (error) {
      console.log(error);
      result = constants.error;
    })
    .finally(function () {
      client.end();
    });
  return result;
}

//
// 入力：セッション名
// 出力：セッション名にかぶりがあるかどうか
//
async function checkSessionName(sessionName) {
  client = dbAPI.clientConnect();
  let isDuplicated = true;
  await dbAPI
    .checkSessionNameDuplicate(client, sessionName)
    .then(function (result) {
      isDuplicated = !(result.rows[0] == undefined);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      client.end();
    });
  return isDuplicated;
}

//
// 入力1：支払いをするユーザー名
// 入力2：支払金額
// 出力：成功か否か
//
async function resisterPayment(sessionName, userName, paymentAmount) {
  client = dbAPI.clientConnect();
  let success = false;
  await dbAPI
    .updatePayment(client, sessionName, userName, paymentAmount)
    .then(function (response) {
      success = true;
      console.log(response);
    })
    .catch(function (error) {
      success = false;
      console.log(error);
    })
    .finally(function () {
      client.end();
    });
  return success;
}

module.exports = router;
