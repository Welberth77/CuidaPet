const express = require("express");

const User = require("../models/user");

const router = express.Router();

router.get("/usuarios", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar usuários",
      details: error.message,
    });
  }
});

module.exports = router;
