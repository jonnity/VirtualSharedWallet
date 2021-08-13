const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  console.log("api get");
  res.send({ data: "無事，受け取ったぜ" });
});

module.exports = router;
