const express = require("express");
const router = express.Router();
const usermodel = require("../models/user");
const bcrypt = require("bcryptjs");

// Obter informações do usuário logado
router.get("/info", (req, res) => {
  // O middleware de autenticação já adicionou as informações do usuário em req.userlogged
  return res.json({
    error: false,
    user: {
      id: req.userlogged.id,
      name: req.userlogged.name,
      email: req.userlogged.email,
    },
  });
});

// Atualizar informações do usuário
router.put("/update", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let updateData = { name, email };

    // Se a senha foi fornecida, hash ela antes de salvar
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateData.password = hash;
    }

    const updatedUser = await usermodel
      .findByIdAndUpdate(req.userlogged.id, updateData, { new: true })
      .select("-password"); // Não retornar a senha

    return res.json({
      error: false,
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Erro ao atualizar usuário: " + error.message,
    });
  }
});

module.exports = router;
