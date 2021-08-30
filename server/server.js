const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const history = require("connect-history-api-fallback");
// const { createEventAdapter } = require("@slack/events-api");
// const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
// const slackEvents = createEventAdapter(slackSigningSecret);

const dbAPI = require("./server_src/dbAPI").router;
const slackAPI = require("./server_src/slackAPI");

const app = express();
app.use(history());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/dbAPI", dbAPI);
app.use("/slackAPI", slackAPI);
// app.use("/slackAPI", slackEvents.requestListener());

app.use("/", serveStatic(path.join(__dirname, "./../vue_content/dist")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./../vue_content/dist/index.html"));
});
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`site is listening on port: ${port}`);
