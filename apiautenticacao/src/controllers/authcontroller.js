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
    },
    authconfig.secret,
    {
      expiresIn: 86400,
    }
  );
};

router.post("/registrar", async (req, res) => {
  const { email } = req.body;

  if (await usermodel.findOne({ email })) {
    return res.status(400).json({
      erro: true,
      message: "Usuario já existe",
    });
  }

  const user = await usermodel.create(req.body);

  user.password = undefined;

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    authconfig.secret,
    {
      expiresIn: 86400,
    }
  );

  return res.json({
    user,
    token: generatetoken(user),
  });
});

router.post("/autenticar", async (req, res) => {
  const { email, password } = req.body;

  const user = await usermodel.findOne({ email }).select("+password");

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

  user.password = undefined;

  return res.json({
    user,
    token: generatetoken(user),
  });
});

module.exports = router;
