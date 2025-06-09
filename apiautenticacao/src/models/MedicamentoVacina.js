const { DataTypes } = require("sequelize");
const sequelize = require("../database/index"); // Aqui você importa a instância do Sequelize

// Criando o modelo para 'medicamentos_vacinas'
const MedicamentoVacina = sequelize.define("MedicamentoVacina", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Referência para o ID do pet
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false, // "medicamento" ou "vacina"
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false, // Nome do medicamento ou vacina
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false, // Data do medicamento/vacina
  },
  proximo: {
    type: DataTypes.STRING,
    allowNull: false, // Intervalo para o próximo medicamento/vacina
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true, // Observações adicionais
  },
});

// Sincronizando o modelo com o banco de dados
// Isso cria a tabela caso ela não exista ainda
//MedicamentoVacina.sync({ alter: true }).then(() => {
//console.log(
//"Tabela 'medicamentos_vacinas' criada ou atualizada com sucesso!"
//);
//});

module.exports = MedicamentoVacina;
