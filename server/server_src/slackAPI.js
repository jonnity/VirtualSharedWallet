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
    const chMembersNameList = await getChMembersNameList(chMembersIdList);
    makeWarikanSession(sessionName, chMembersIdList);
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
  var config = {
    method: "get",
    url: "https://slack.com/api/conversations.members",
    params: params,
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  let channelUserIdList = [];
  await axios(config)
    .then(function (response) {
      channelUserIdList = response.data.members;
    })
    .catch(function (error) {
      console.log(error);
    });
  return channelUserIdList;
}

async function getChMembersNameList(sessionName, chMembersIdList) {}
module.exports = router;
