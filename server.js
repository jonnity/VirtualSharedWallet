const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const history = require("connect-history-api-fallback");

const checkSessionNameDuplicateRouter = require("./server_src/api/checkSessionNameDuplicate");
const resisterSessionAndShareRouter = require("./server_src/api/resisterSessionAndShare");

const app = express();
app.use(history());
app.use(express.json());

app.use("/checkSessionName", checkSessionNameDuplicateRouter);
app.use("/shareSession", resisterSessionAndShareRouter);

app.use("/", serveStatic(path.join(__dirname, "./vue_content/dist")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./vue_content/dist/index.html"));
});
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`site is listening on port: ${port}`);
