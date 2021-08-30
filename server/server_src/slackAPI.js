require("dotenv").config();

const express = require("express");
const router = express.Router();
const axios = require("axios");

const constants = require("./constants");
const dbAPI = require("./dbAPI");

const token = process.env.SLACK_TOKEN;

router.post("/startSlackSession", async function (req, res) {
  console.log("---------------------headers---------------------");
  console.log(req.headers);
  console.log("---------------------body---------------------");
  console.log(req.body);
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

async function getChMembersIdList(channelId) {
  const params = {
    channel: channelId,
    pretty: 1,
  };
  var axiosConfigChMembers = {
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
  dbAPI
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

module.exports = router;
