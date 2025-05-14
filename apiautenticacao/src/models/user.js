const { DataTypes } = require("sequelize");
const bcryptjs = require("bcryptjs");
const sequelize = require("../database/index");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "nome", // corresponde à coluna "nome" criada no banco
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "email",
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "senha", // corresponde à coluna "senha" criada no banco
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updatedAt",
    },
  },
  {
    tableName: "Users", // usa exatamente a tabela que você criou manualmente
    timestamps: true, // Sequelize gerencia createdAt e updatedAt automaticamente
    hooks: {
      beforeCreate: async (user) => {
        const hash = await bcryptjs.hash(user.password, 10);
        user.password = hash;
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const hash = await bcryptjs.hash(user.password, 10);
          user.password = hash;
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

module.exports = User;
