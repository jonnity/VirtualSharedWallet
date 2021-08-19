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

    const query_session_master = {
      text: "SELECT user_name, user_payment FROM users WHERE session_name = $1",
      values: [sessionName],
    };

    let userNameList = [];
    let paymentList = [];
    client
      .query(query_session_master)
      .then(function (result) {
        for (let un = 0; un < result.rows.length; un++) {
          userNameList.push(result.rows[un].user_name);
          paymentList.push(result.rows[un].user_payment);
        }
      })
      .catch(function (error) {
        console.log(error);
        res.send(constants.error);
      })
      .finally(function () {
        res.send({
          userNameList: userNameList,
          paymentList: paymentList,
        });
      });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
