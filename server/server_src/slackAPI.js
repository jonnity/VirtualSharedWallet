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
    const userList = await slackClient.users.list();
    consoleUsers(userList.members);
    // console.log("slackClient.users.list();" + userList.members);

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

function consoleUsers(usersArray) {
  let userId = "";
  usersArray.forEach(function (user) {
    // Key user info on their unique user ID
    userId = user["id"];
    console.log(userId);
    // Store the entire user object (you may not need all of the info)
  });
}
module.exports = router;
