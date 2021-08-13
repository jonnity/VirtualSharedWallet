const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const history = require("connect-history-api-fallback");

const testRouter = require("./api/test.js");

const app = express();
app.use(history());
app.use("/test", testRouter);

app.use("/", serveStatic(path.join(__dirname, "./vue_content/dist")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./vue_content/dist/index.html"));
});
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`site is listening on port: ${port}`);
