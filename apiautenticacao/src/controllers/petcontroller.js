const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Pet = require("../models/pet");
const authenticate = require("../middlewares/authenticate");

// Biblioteca de raças, cores e pelagens válidas
const validData = {
  especie: ["cachorro", "gato"],
  sexo: ["macho", "femea"],
  pelagem: ["curta", "media", "longa", "sem_pelo"],
  corPelagem: {
    cachorro: [
      "preto",
      "branco",
      "caramelo",
      "marrom",
      "cinza",
      "bege",
      "preto e branco",
      "marrom e branco",
      "tricolor",
      "tigrado",
      "dourado",
      "fígado",
    ],
    gato: [
      "preto",
      "branco",
      "rajado",
      "cinza",
      "ruivo (laranja)",
      "marrom",
      "tigrado",
      "calico (tricolor)",
      "tortoiseshell (casco de tartaruga)",
      "preto e branco",
      "colorpoint (tipo siamês)",
    ],
  },
  raca: {
    cachorro: [
      "bulldog",
      "vira-lata",
      "labrador retriever",
      "shih tzu",
      "poodle",
      "yorkshire terrier",
      "pinscher",
      "bulldogue francês",
      "golden retriever",
      "chihuahua",
      "pastor alemão",
      "dachshund (Salsicha)",
      "rottweiler",
      "pug",
      "maltês",
      "border collie",
    ],
    gato: [
      "vira-lata",
      "siamês",
      "persa",
      "maine coon",
      "angorá",
      "sphynx (Sem pelo)",
      "ragdoll",
      "british shorthair (Pelo curto inglês)",
      "bengal",
      "exótico (Pelo curto)",
      "norueguês da floresta",
      "himalaio",
    ],
  },
};

// Cadastrar um pet
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.userlogged.id;
    const {
      nome,
      especie,
      raca,
      sexo,
      peso,
      nascimento,
      corPelagem,
      pelagem,
      sobre,
    } = req.body;

    // Validações
    if (!validData.especie.includes(especie)) {
      return res
        .status(400)
        .json({ error: true, message: "Espécie inválida." });
    }
    if (!validData.sexo.includes(sexo)) {
      return res.status(400).json({ error: true, message: "Sexo inválido." });
    }
    if (!validData.pelagem.includes(pelagem)) {
      return res
        .status(400)
        .json({ error: true, message: "Pelagem inválida." });
    }
    if (!validData.raca[especie].includes(raca)) {
      return res
        .status(400)
        .json({ error: true, message: "Raça inválida para essa espécie." });
    }
    if (!validData.corPelagem[especie].includes(corPelagem)) {
      return res.status(400).json({
        error: true,
        message: "Cor da pelagem inválida para essa espécie.",
      });
    }

    const pet = await Pet.create({
      nome,
      especie,
      raca,
      sexo,
      peso,
      nascimento,
      corPelagem,
      pelagem,
      sobre,
      userId,
    });

    return res.status(201).json({ pet });
  } catch (error) {
    console.error("Erro ao salvar pet:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao cadastrar pet",
      details: error.message,
    });
  }
});

// Listar pets do usuário
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userlogged.id;
    const pets = await Pet.findAll({ where: { userId } });
    return res.json({ pets });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar pets",
      details: error.message,
    });
  }
});

module.exports = router;
