const { DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const Pet = sequelize.define(
  "Pet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "nome",
    },
    especie: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "especie",
    },
    raca: {
      type: DataTypes.STRING,
      field: "raca",
    },
    sexo: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["macho", "femea"]],
      },
      field: "sexo",
    },
    peso: {
      type: DataTypes.DECIMAL(5, 2),
      field: "peso",
    },
    nascimento: {
      type: DataTypes.DATEONLY,
      field: "nascimento",
    },
    corPelagem: {
      type: DataTypes.STRING,
      field: "cor_pelagem",
    },
    pelagem: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["curta", "media", "longa", "sem_pelo"]],
      },
      field: "pelagem",
    },
    sobre: {
      type: DataTypes.TEXT,
      field: "sobre",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Users_id",
    },
  },
  {
    tableName: "pet",
    timestamps: false,
  }
);

module.exports = Pet;
