require("dotenv").config();

const express = require("express");
const router = express.Router();
const constants = require("./constants");
const { WebClient } = require("@slack/web-api");
// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;
// Initialize
const web = new WebClient(token);

// const dbAPI = require("./dbAPI");

router.post("/startSlackSession", function (req, res) {
  console.log(req);
  const result = await web.chat.postMessage({
    text: "Hello world!",
  });
  console.log(result);
  return "success";
});

module.exports = router;
