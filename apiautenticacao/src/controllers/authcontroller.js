const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const authconfig = require("../config/auth.json");

const User = require("../models/user");

const router = express.Router();

const generatetoken = (user = {}) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    authconfig.secret,
    {
      expiresIn: 86400,
    }
  );
};

router.post("/registrar", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        erro: true,
        message: "Usuario já existe",
      });
    }

    const user = await User.create(req.body);

    return res.json({
      user,
      token: generatetoken(user),
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao registrar usuário",
      details: error.message,
    });
  }
});

router.post("/autenticar", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.scope("withPassword").findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Usuario não encontrado",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({
        error: true,
        message: "Senha invalida",
      });
    }

    return res.json({
      user,
      token: generatetoken(user),
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao autenticar usuário",
      details: error.message,
    });
  }
});

module.exports = router;
