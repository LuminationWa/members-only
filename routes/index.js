const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});

module.exports = router;
