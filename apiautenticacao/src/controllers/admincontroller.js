const express = require("express");

const User = require("../models/user");

const router = express.Router();

// Buscar todos os usuários
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

// Atualizar usuário
router.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body; // <-- removido o email daqui

    const user = await User.scope("withPassword").findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualiza somente os campos permitidos
    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();

    // Atualiza e retorna sem a senha
    const userResponse = await User.findByPk(id); // para garantir que venha sem o password
    return res.json({ user: userResponse });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao atualizar usuário",
      details: error.message,
    });
  }
});

module.exports = router;
