require("dotenv").config();

const express = require("express");
const router = express.Router();
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
  console.log(req.body.team_domain) + "でセッション名決めればいいか．↓とか";
  console.log("slack_" + req.body.team_domain);
  try {
    // const userList = await slackClient.users.list();
    // userNameList = storeUserNameToArray(userList.members);
    // console.log("userNameList" + userNameList);
    const channelUserNameList = await slackClient.conversations.members(
      req.body.channel_id
    );
    console.log(channelUserNameList);

    // const result = await web.chat.postMessage({
    //   text: "Hello world!",
    // });
    // console.log(result);
    // return "success";
    let data = {
      response_type: "in_channel",
      text: "302: Found",
      attachments: [
        {
          image_url: "https://http.cat/302.jpg",
        },
      ],
    };
    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

// function storeUserNameToArray(usersArray) {
//   let userName = "";
//   let userNameList = [];
//   usersArray.forEach(function (user) {
//     userName = user["name"];
//     userNameList.push(userName);
//     // Store the entire user object (you may not need all of the info)
//   });
//   return userNameList;
// }
module.exports = router;
