require("dotenv").config();

const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const constants = require("../constants");

router.post("/", function (req, res) {
  const sessionName = req.body.sessionName;
  const userNameList = req.body.userNameList;
  const paymentList = req.body.paymentList;

  console.log(req.body);

  const client = new Client({
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASS,
    host: process.env.POSTGRE_HOST,
    port: process.env.POSTGRE_PORT,
    database: process.env.POSTGRE_DB_NAME,
  });
  try {
    client.connect();

    const query_session_master = {
      text: "INSERT INTO session_master(session_name, pass_hash, create_time, update_time) VALUES($1, $2, now(), now())",
      values: [sessionName, ""],
    };

    client.query(query_session_master).then(function (result) {
      console.log(result);
      for (let un = 0; un < userNameList.length; un++) {
        const name = userNameList[un];
        const payment = paymentList[un];
        const query_users = {
          text: "INSERT INTO users(session_name, user_name, user_payment) VALUES($1, $2, $3)",
          values: [sessionName, name, payment],
        };
        client.query(query_users).then(function (result) {
          console.log(result);
        });
      }
    });
  } catch (e) {
    console.log(e);
  }

  // resisterSessionNameAndUserInfo(sessionName, userNameList, userPaymentList);

  // const sessionPass = req.body.sessionPass;
  // if (sessionPass !== "" && sessionPass !== null) {
  //   hashAndResisterSessionPass(sessionName, sessionPass);
  // }
  // res.send({ result: constants.success });
});

module.exports = router;

function isDuplicatedSessionName(sessionName) {}
