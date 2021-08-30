require("dotenv").config();

const express = require("express");
const router = express.Router();
const axios = require("axios");
const constants = require("./constants");
const { WebClient } = require("@slack/web-api");
// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;
// Initialize

// const dbAPI = require("./dbAPI");
const slackClient = new WebClient(token);

router.post("/startSlackSession", async function (req, res) {
  console.log("---------------------headers---------------------");
  console.log(req.headers);
  console.log("---------------------body---------------------");
  console.log(req.body);
  // console.log(req.body.team_domain) + "でセッション名決めればいいか．↓とか";
  // console.log("slack_" + req.body.team_domain);
  // console.log("---------------------req.body.channel_id---------------------");
  // console.log(req.body.channel_id);
  const sessionName = "slack" + req.body.channel_id;
  try {
    const chMembersIdList = await getChMembersIdList(req.body.channel_id);
    console.log(chMembersIdList);
    const chMembersNameList = await makeUserNameList(chMembersIdList);
    console.log(chMembersNameList);
    // makeWarikanSession(sessionName, chMembersIdList);
    let data = {
      response_type: "in_channel",
      text:
        "割勘のセッションを開始しました（" +
        constants.appURL +
        "?sessionName=" +
        sessionName +
        "）",
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
      console.log(values);
      for (let vi = 0; vi < values.length; vi++) {
        if (!values[vi].ok) {
          continue;
        }
        if (!values[vi].user.is_bot) {
          userNameList.push(values.user.name);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  return userNameList;
}

module.exports = router;
