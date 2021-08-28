require("dotenv").config();

const express = require("express");
const router = express.Router();
const constants = require("./constants");
const { WebClient } = require("@slack/web-api");
// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;
// Initialize
const slackClient = new WebClient(token);

// const dbAPI = require("./dbAPI");

router.post("/startSlackSession", async function (req, res) {
  console.log(slackClient);
  console.log("---------------------headers---------------------");
  console.log(req.headers);
  console.log("---------------------body---------------------");
  console.log(req.body);
  console.log(req.body.team_domain) + "でセッション名決めればいいか．↓とか";
  console.log("slack_" + req.body.team_domain);
  const userList = await client.users.list();
  console.log("client.users.list();" + userList);
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
});

module.exports = router;
