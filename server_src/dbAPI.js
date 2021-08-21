require("dotenv").config();

const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const constants = require("./constants");

const postgreInfo = {
  user: process.env.POSTGRE_USER,
  password: process.env.POSTGRE_PASS,
  host: process.env.POSTGRE_HOST,
  port: process.env.POSTGRE_PORT,
  database: process.env.POSTGRE_DB_NAME,
};

router.post("/checkSessionName", function (req, res) {
  const client = new Client(postgreInfo);
  try {
    client.connect();

    const sessionName = req.body.sessionName;
    const queryCheckSessionName = {
      text: "SELECT session_name FROM session_master WHERE session_name=$1",
      values: [sessionName],
    };

    client
      .query(queryCheckSessionName)
      .then(function (result) {
        // セッション名で検索して結果があるかどうか
        const isAlreadyExist = result.rows[0] !== undefined;
        if (isAlreadyExist) {
          console.log("重複あり");
          res.send({ result: constants.sessionNameDuplicateError });
        } else {
          console.log("重複なし");
          res.send({ result: constants.success });
        }
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error, error: error });
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/getUserInfo", function (req, res) {
  const client = new Client(postgreInfo);
  try {
    client.connect();

    const sessionName = req.body.sessionName;
    const queryGetUserInfo = {
      text: "SELECT user_name, user_payment FROM users WHERE session_name = $1",
      values: [sessionName],
    };

    let userNameList = [];
    let paymentList = [];
    client
      .query(queryGetUserInfo)
      .then(function (result) {
        for (let un = 0; un < result.rows.length; un++) {
          userNameList.push(result.rows[un].user_name);
          paymentList.push(result.rows[un].user_payment);
        }
        res.send({
          userNameList: userNameList,
          paymentList: paymentList,
        });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error, error: error });
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/resisterSession", function (req, res) {
  const client = new Client(postgreInfo);
  try {
    client.connect();

    const sessionName = req.body.sessionName;
    const userNameList = req.body.userNameList;
    const paymentList = req.body.paymentList;
    const queryResisterSession = {
      text: "INSERT INTO session_master(session_name, pass_hash, create_time, update_time) VALUES($1, $2, now(), now())",
      values: [sessionName, ""],
    };

    client.query(queryResisterSession).then(function (result) {
      //
      // パスワードもあったら，ここでcreate_timeをソルトにしてハッシュを保存する
      //
      console.log(result);
      for (let un = 0; un < userNameList.length; un++) {
        const name = userNameList[un];
        const payment = paymentList[un];
        const queryResisterUserInfo = {
          text: "INSERT INTO users(session_name, user_name, user_payment) VALUES($1, $2, $3)",
          values: [sessionName, name, payment],
        };
        client.query(queryResisterUserInfo).then(function (result) {
          console.log(result);
        });
      }
      res.send({
        result: constants.success,
        shareLink: constants.appURL + "?sessionName=" + sessionName,
      });
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
