require("dotenv").config();

const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const constants = require("./constants");

function clientConnect() {
  const postgreInfo = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // user: process.env.POSTGRE_USER,
    // password: process.env.POSTGRE_PASS,
    // host: process.env.POSTGRE_HOST,
    // port: process.env.POSTGRE_PORT,
    // database: process.env.POSTGRE_DB_NAME,
  };
  try {
    const client = new Client(postgreInfo);
    client.connect();
    return client;
  } catch (e) {
    console.log(e);
  }
}

async function passwordAuthentication(client, sessionName, cipheredPassword) {
  const myCipher = require("./myCipher");
  const password = myCipher.myDecrypt(cipheredPassword);
  const queryPassAuth = {
    text: "SELECT (pass_hash = crypt($2, pass_hash)) AS matched FROM session_master WHERE session_name = $1",
    values: [sessionName, password],
  };
  try {
    let matched = false;
    await client
      .query(queryPassAuth)
      .then(function (result) {
        console.log("result.rows[0].matched: " + result.rows[0].matched);
        matched = result.rows[0].matched;
      })
      .catch(function (error) {
        console.log(error);
      });
    // .finally(function () {
    //   client.end();
    // });
    return matched;
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
    text: "INSERT INTO session_master(session_name, pass_hash, create_time, update_time) VALUES($1, crypt($2, gen_salt('bf')), now(), now())",
    values: [sessionName, password],
  };
  return client.query(queryResisterSession);
}

function resisterUserInfo(client, sessionName, userName, payment) {
  const queryResisterUserInfo = {
    text: "INSERT INTO users(session_name, user_name, user_payment) VALUES($1, $2, $3)",
    values: [sessionName, userName, payment],
  };
  return client.query(queryResisterUserInfo);
}

function deleteUser(client, sessionName, userName) {
  const queryDeleteUser = {
    text: "DELETE FROM users WHERE session_name = $1 AND user_name = $2",
    values: [sessionName, userName],
  };
  return client.query(queryDeleteUser);
}

function updatePayment(client, sessionName, userName, paymentAmount) {
  const queryRepayment = {
    text: "UPDATE users SET user_payment = user_payment + $3 WHERE session_name = $1 AND user_name = $2",
    values: [sessionName, userName, paymentAmount],
  };
  return client.query(queryRepayment);
}

function checkExistPassword(client, sessionName) {
  const queryCheckExistPassword = {
    text: "SELECT (pass_hash = crypt($2, pass_hash)) AS matched FROM session_master WHERE session_name = $1",
    values: [sessionName, constants.throughPassword],
  };
  return client.query(queryCheckExistPassword);
}

async function updateUpdateTime(client, sessionName) {
  const queryUpdateTime = {
    text: "UPDATE session_master SET update_time = now() WHERE session_name = $1",
    values: [sessionName],
  };
  try {
    await client
      .query(queryUpdateTime)
      .then(function (result) {
        console.log(result);
      })
      .catch(function (error) {
        console.log(error);
      });
    // .finally(function () {
    //   client.end();
    // });
  } catch (e) {
    console.log(e);
  }
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
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/getUserInfo", async function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const password = req.body.encryptedPassword;

    const passwordMatched = await passwordAuthentication(
      client,
      sessionName,
      password
    );
    if (!passwordMatched) {
      res.send({ result: constants.wrongPassword });
      return;
    }

    let userNameList = [];
    let paymentList = [];
    getUserInfo(client, sessionName)
      .then(function (result) {
        for (let un = 0; un < result.rows.length; un++) {
          userNameList.push(result.rows[un].user_name);
          paymentList.push(result.rows[un].user_payment);
        }
        res.send({
          result: constants.success,
          userNameList: userNameList,
          paymentList: paymentList,
        });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error, error: error });
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/resisterSession", function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const password = req.body.password;
    const userNameList = req.body.userNameList;
    const paymentList = req.body.paymentList;

    resisterSession(client, sessionName, password)
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
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/appendUser", async function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const userName = req.body.userName;
    const encryptedPassword = req.body.encryptedPassword;

    const passwordMatched = await passwordAuthentication(
      client,
      sessionName,
      encryptedPassword
    );
    if (!passwordMatched) {
      res.send({ result: constants.wrongPassword });
      return;
    }
    resisterUserInfo(client, sessionName, userName, 0)
      .then(function (result) {
        console.log(result);
        await updateUpdateTime(client, sessionName);
        res.send({ result: constants.success });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error });
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/deleteUser", async function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const userName = req.body.userName;
    const encryptedPassword = req.body.encryptedPassword;

    const passwordMatched = await passwordAuthentication(
      client,
      sessionName,
      encryptedPassword
    );
    if (!passwordMatched) {
      res.send({ result: constants.wrongPassword });
      return;
    }

    deleteUser(client, sessionName, userName)
      .then(function (result) {
        console.log(result);
        await updateUpdateTime(client, sessionName);
        res.send({ result: constants.success });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error });
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/updatePayment", async function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const userName = req.body.userName;
    const paymentAmount = req.body.paymentAmount;
    const encryptedPassword = req.body.encryptedPassword;

    const passwordMatched = await passwordAuthentication(
      client,
      sessionName,
      encryptedPassword
    );
    if (!passwordMatched) {
      res.send({ result: constants.wrongPassword });
      return;
    }

    updatePayment(client, sessionName, userName, paymentAmount)
      .then(function (result) {
        console.log(result);
        await updateUpdateTime(client, sessionName);
        res.send({ result: constants.success });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error });
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/repayment", async function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    const payerName = req.body.payer;
    const receiverName = req.body.receiver;
    const paymentAmount = req.body.paymentAmount;
    const encryptedPassword = req.body.encryptedPassword;

    const passwordMatched = await passwordAuthentication(
      client,
      sessionName,
      encryptedPassword
    );
    if (!passwordMatched) {
      res.send({ result: constants.wrongPassword });
      return;
    }

    updatePayment(client, sessionName, payerName, paymentAmount)
      .then(function (result) {
        updatePayment(client, sessionName, receiverName, -paymentAmount)
          .then(function (result) {
            console.log(result);
            await updateUpdateTime(client, sessionName);
          })
          .catch(function (error) {
            console.log(error);
            res.status(500).send({ result: constants.error });
          });
        console.log(result);
        res.send({ result: constants.success });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error });
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/checkExistPassword", function (req, res) {
  const client = clientConnect();
  try {
    const sessionName = req.body.sessionName;
    checkExistPassword(client, sessionName)
      .then(function (result) {
        console.log(result);
        const existPassword = !result.rows[0].matched;
        res.send({
          result: constants.success,
          existPassword: existPassword,
        });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send({ result: constants.error });
      })
      .finally(function () {
        client.end();
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/encryptPassword", function (req, res) {
  const myCipher = require("./myCipher");
  const plainPassword = req.body.password;
  res.send({ encryptedPassword: myCipher.myEncrypt(plainPassword) });
});

module.exports = router;
