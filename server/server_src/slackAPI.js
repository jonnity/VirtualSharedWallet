require("dotenv").config();

const express = require("express");
const router = express.Router();
const constants = require("./constants");
const { createEventAdapter } = require("@slack/events-api");
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

const dbAPI = require("./dbAPI");

router.post("/startSlackSession", function (req, res) {
  console.log(req);
  res.send("success!!");
});

module.exports = router;
