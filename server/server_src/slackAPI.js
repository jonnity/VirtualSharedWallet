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
  console.log("-------------header-------------");
  console.log(req.headers);
  console.log("-------------body-------------");
  console.log(req.body);
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

    const receivedText = req.body.text;
    const texts = receivedText.split(/[<|>]/);
    const payment = Number(texts[3].trim());
    const atPayerId = texts[1];
    let payerId = "";
    for (let ati = 1; ati < atPayerId.length; ati++) {
      payerId += atPayerId[ati];
    }
    const payerRealNameList = await makeUserNameList([payerId]);
    const payerRealName = payerRealNameList[0];
    const resisterSuccess = await resisterPayment(
      sessionName,
      payerRealName,
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
          userNameList.push(values[vi].data.user.real_name);
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

//
// OAuth用のリダイレクト処理
//
router.get("/callback", function (req, res, next) {
  const request = require("request");

  const code = req.query.code;
  if (code) {
    var option = {
      url:
        "https://slack.com/api/oauth.access?client_id=" +
        process.env.SLACK_CLIENR_ID +
        "&client_secret=" +
        process.env.SLACK_CLIENR_SECRET +
        "&code=" +
        code,
      method: "GET",
    };
    request(option, (err0, res0, body0) => {
      if (err0) {
        return res.status(403).send({ status: false, error: err0 });
      } else {
        body0 = JSON.parse(body0);
        var access_token = body0.access_token;

        req.session.oauth = {};
        req.session.oauth.provider = "slack";
        req.session.oauth.user_id = body0.user_id;
        req.session.oauth.team_id = body0.team_id;
        req.session.oauth.team_name = body0.team_name;
        req.session.oauth.access_token = body0.access_token;

        var token = jwt.sign(req.session.oauth, settings.superSecret, {
          expiresIn: "25h",
        });
        req.session.token = token;
        //res.send( "Worked." );
        res.redirect("/slackAPI");
      }
    });
  } else {
    //next( new Error( "you are not supposed to be here." ) );
    res.redirect("/slackAPI");
  }
});
router.get("/", function (req, res) {
  if (req.session && req.session.token) {
    var token = req.session.token;
    jwt.verify(token, settings.superSecret, function (err, oauth) {
      if (!err && oauth) {
        //console.log( oauth );
        res.render("index", { oauth: oauth });
      } else {
        console.log(err);
        res.render("index", { oauth: null });
      }
    });
  } else {
    res.render("index", { oauth: null });
  }
});

module.exports = router;
