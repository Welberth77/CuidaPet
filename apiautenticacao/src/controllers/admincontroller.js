const express = require("express");

const router = express.Router();

router.get("/usuarios", (req, res) => {
  console.log("controller");
  return res.json({});
});

module.exports = router;
