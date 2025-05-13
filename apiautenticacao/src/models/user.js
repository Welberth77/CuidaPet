const { DataTypes } = require("sequelize");

const bcryptjs = require("bcryptjs");

const sequelize = require("../database/index");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
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
