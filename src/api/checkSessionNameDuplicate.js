require("dotenv").config();

const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const constants = require("../constants");

router.post("/", function (req, res) {
  const sessionName = req.body.sessionName;

  const client = new Client({
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASS,
    host: process.env.POSTGRE_HOST,
    port: process.env.POSTGRE_PORT,
    database: process.env.POSTGRE_DB_NAME,
  });
  try {
    client.connect();

    const query =
      "SELECT session_name FROM session_master WHERE session_name=" +
      "'" +
      sessionName +
      "'";

    client
      .query(query)
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
        res.send({ result: constants.error });
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
