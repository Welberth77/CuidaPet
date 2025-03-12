const express = require("express");

const router = express.Router();

router.get("/usuarios", (req, res) => {
  return res.json({});
});

module.exports = router;
