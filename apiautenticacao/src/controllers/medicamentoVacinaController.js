const express = require("express");
const router = express.Router();
const Pet = require("../models/pet"); // Assumindo que você tem o modelo Pet
const MedicamentoVacina = require("../models/MedicamentoVacina");

// Rota para listar todos os pets cadastrados
router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets); // Garanta que isso retorne um array
  } catch (error) {
    res.status(500).json({ error: "Erro ao recuperar pets" });
  }
});
// No medicamentoVacinaController.js, altere:
router.post("/:id/medicamento-vacina", async (req, res) => {
  const {
    categoria,
    nomeMedicamentoVacina,
    dataMedicamentoVacina,
    dataProxMedicamentoVacina,
    observacoes,
  } = req.body;

  // Encontra o pet pelo ID
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) {
    return res.status(404).json({ error: "Pet não encontrado" });
  }

  // Criação do registro no banco de dados
  try {
    const registro = await MedicamentoVacina.create({
      pet_id: pet.id, // Relacionando com o pet
      categoria,
      nome: nomeMedicamentoVacina,
      data: dataMedicamentoVacina,
      proximo: dataProxMedicamentoVacina,
      observacoes,
    });

    res.status(201).json({
      message: "Medicamento/Vacina registrado com sucesso!",
      registro,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar o registro" });
  }
});

// Rota para listar medicamentos e vacinas de um pet
router.get("/:nome/medicamentos-vacinas", async (req, res) => {
  const pet = await Pet.findOne({ where: { nome: req.params.nome } });
  if (!pet) {
    return res.status(404).json({ error: "Pet não encontrado" });
  }

  try {
    const medicamentosVacinas = await MedicamentoVacina.findAll({
      where: { pet_id: pet.id },
    });

    res.json(medicamentosVacinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao recuperar os registros" });
  }
});

module.exports = router;
