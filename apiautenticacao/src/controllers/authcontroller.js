const express = require("express");

const usermodel = require("../models/user");

const router = express.Router();

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

  return res.json({
    error: false,
    message: "Registrado com sucesso",
    data: user,
  });
});

router.post("/autenticar", async (req, res) => {
  const { email, password } = req.body;

  const user = await usermodel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: true,
      message: "Usuario não encontrado",
    });
  }

  return res.json(user);
});

module.exports = router;
