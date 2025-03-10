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

  return res.json({
    error: false,
    message: "Registrado com sucesso",
    data: user,
  });
});

module.exports = router;
