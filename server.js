const express = require("express");
const serveStatic = require("serve-static");
const history = require("connect-history-api-fallback");

const path = require("path");

const app = express();
app.use(history());

app.use("/", serveStatic(path.join(__dirname, "/wa_warikan/dist")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/wa_warikan/dist/index.html"));
});
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`site is listening on port: ${port}`);
