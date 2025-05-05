const mongoose = require("../database/index");

const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  const hash = await bcryptjs.hash(this.password, 10);
  console.log(this);
  console.log(hash);
  this.password = hash;
});

const user = mongoose.model("user", userSchema);

module.exports = user;

const { DataTypes } = require("sequelize");

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
