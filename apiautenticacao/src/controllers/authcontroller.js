const express = require("express");

const usermodel + require("../models/user");

const router = express.Router();

router.post("/registrar", (req, res) => {
    console.log(req.body);
    return res.json({
        error: false,
        message:"Registrado com sucesso"
    });
})

module.exports = router;