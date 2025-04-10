const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authconfig = require("../config/auth.json");
const usermodel = require("../models/user");

const router = express.Router();

const generatetoken = (user = {}) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email, // Adicionando email ao token
    },
    authconfig.secret,
    {
      expiresIn: 86400,
    }
  );
};

router.post("/registrar", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Validações básicas
    if (!email || !name || !password) {
      return res.status(400).json({
        error: true,
        message: "Todos os campos são obrigatórios",
      });
    }

    if (await usermodel.findOne({ email })) {
      return res.status(400).json({
        error: true,
        message: "Usuário já existe",
      });
    }

    const user = await usermodel.create(req.body);
    user.password = undefined;

    return res.json({
      error: false,
      message: "Usuário registrado com sucesso",
      user,
      token: generatetoken(user),
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao registrar usuário: " + error.message,
    });
  }
});

router.post("/autenticar", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email e senha são obrigatórios",
      });
    }

    const user = await usermodel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Usuário não encontrado",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({
        error: true,
        message: "Senha inválida",
      });
    }

    user.password = undefined;

    return res.json({
      error: false,
      message: "Login realizado com sucesso",
      user,
      token: generatetoken(user),
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao autenticar usuário: " + error.message,
    });
  }
});

module.exports = router;
