require("dotenv").config();

const express = require("express");
const app = express();

const { Client } = require("pg");

app.get("/", function (req, res, next) {
  console.log("getリクエスト");
  const client = new Client({
    database: "test",
    user: "postgres",
    password: process.env.POSTGRE_PASS,
    host: "localhost",
    port: 5432,
  });
  // client
  //   .query("SELECT user_name, user_payment FROM users")
  //   .then((res) => console.log(res))
  //   .catch((e) => console.error(e.stack));
  // client.query(
  //   "SELECT user_name, user_payment FROM users",
  //   function (err, result) {
  //     res.render("index", {
  //       title: "Express",
  //       datas: result,
  //     });
  //     console.log(result); //コンソール上での確認用なため、この1文は必須ではない。
  //   }
  // );

  client.connect();
  client
    .query("SELECT user_name, user_payment FROM users")
    .then((result) => res.send(result.rows))
    .catch((e) => console.error(e.stack))
    .then(() => client.end());
});

app.listen("3001", () => {
  console.log("listen at 3001");
});
