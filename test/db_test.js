require("dotenv").config();

const express = require("express");
const app = express();

const { Client } = require("pg");

app.get("/", function (req, res, next) {
  const client = new Client({
    database: "test",
    user: "postgres",
    password: process.env.POSTGRE_PASS,
    host: "localhost",
    port: 5432,
  });
  client.connect();
  // 登録済みのセッション名の一覧を取得するクエリ
  client
    .query(
      "select session_name from session_master where session_name=" +
        "'test_session3'"
    )
    .then(function (result) {
      console.log(result.rows[0]);
      console.log(result.rows[0] === undefined);
    });
  // ユーザー情報取るクエリ
  // .query("SELECT user_name, user_payment FROM users")
  // .then((result) => res.send(result.rows))
  // .catch((e) => console.error(e.stack))
  // .then(() => client.end());
});

app.listen("3001", () => {
  console.log("listen at 3001");
});
