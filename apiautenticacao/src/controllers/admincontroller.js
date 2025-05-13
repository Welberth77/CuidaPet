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

router.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.scope("withPassword").findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    user.name = name;
    user.email = email;
    if (password) user.password = password;

    await user.save();

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao atualizar usuário",
      details: error.message,
    });
  }
});

module.exports = router;
