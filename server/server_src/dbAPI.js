require("dotenv").config();

const { query } = require("express");
const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const constants = require("./constants");

function clientConnect() {
  const postgreInfo = {
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASS,
    host: process.env.POSTGRE_HOST,
    port: process.env.POSTGRE_PORT,
    database: process.env.POSTGRE_DB_NAME,
  };
  try {
    const client = new Client(postgreInfo);
    client.connect();
    return client;
  } catch (e) {
    console.log(e);
  }
}

function checkSessionNameDuplicate(client, sessionName) {
  const queryCheckSessionName = {
    text: "SELECT session_name FROM session_master WHERE session_name=$1",
    values: [sessionName],
  };
  return client.query(queryCheckSessionName);
}

function getUserInfo(client, sessionName) {
  const queryGetUserInfo = {
    text: "SELECT user_name, user_payment FROM users WHERE session_name = $1",
    values: [sessionName],
  };
  return client.query(queryGetUserInfo);
}

function resisterSession(client, sessionName, password) {
  const queryResisterSession = {
    text: "INSERT INTO session_master(session_name, pass_hash, create_time, update_time) VALUES($1, crypt('$2', gen_salt('bf')), now(), now())",
    values: [sessionName, password],
  };
  return client.query(queryResisterSession);
}

function resisterUserInfo(client, sessionName, name, payment) {
  const queryResisterUserInfo = {
    text: "INSERT INTO users(session_name, user_name, user_payment) VALUES($1, $2, $3)",
    values: [sessionName, name, payment],
  };
  return client.query(queryResisterUserInfo);
}

router.post("/checkSessionName", function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    checkSessionNameDuplicate(client, sessionName)
      .then(function (result) {
        // セッション名で検索して結果があるかどうか
        const isAlreadyExist = result.rows[0] !== undefined;
        if (isAlreadyExist) {
          console.log("重複あり");
          res.send({ result: constants.sessionNameDuplicate });
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
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;

    let userNameList = [];
    let paymentList = [];
    getUserInfo(client, sessionName)
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
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const userNameList = req.body.userNameList;
    const paymentList = req.body.paymentList;

    resisterSession(client, sessionName, "")
      .then(function (result) {
        console.log(result);
        for (let un = 0; un < userNameList.length; un++) {
          const name = userNameList[un];
          const payment = paymentList[un];
          resisterUserInfo(client, sessionName, name, payment)
            .then(function (result) {
              console.log(result);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        res.send({
          result: constants.success,
          shareLink: constants.appURL + "?sessionName=" + sessionName,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/appendUser", function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const userName = req.body.userName;
    resisterUserInfo(client, sessionName, userName, 0)
      .then(function (result) {
        console.log(result);
        res.send({ result: constants.success });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error });
      });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
