require("dotenv").config();

const express = require("express");
const app = express();

const { Client } = require("pg");

function clientConnect(sessionName) {
  const client = new Client({
    database: "test",
    user: "postgres",
    password: process.env.POSTGRE_PASS,
    host: "localhost",
    port: 5432,
  });
  client.connect();
  // 登録済みのセッション名の一覧を取得するクエリ
  return client.query({
    text: "select session_name from session_master where session_name=$1",
    values: [sessionName],
  });
}

app.get("/", function (req, res, next) {
  // client.connect();
  // // 登録済みのセッション名の一覧を取得するクエリ
  // client
  //   .query({
  //     text: "select session_name from session_master where session_name=$1",
  //     values: ["test_session"],
  //   })
  clientConnect("test_session").then(function (result) {
    console.log(result.rows[0]);
    console.log(result.rows[0] === undefined);
    res.send(result);
  });
});

app.listen("3001", () => {
  console.log("listen at 3001");
});
