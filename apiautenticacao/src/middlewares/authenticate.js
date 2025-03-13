const jwt = require("jsonwebtoken");

const authconfig = require("../config/auth.json");

module.exports = (req, res, next) => {
  const authheader = req.headers.authorization;

  if (!authheader) {
    return res.status(401).json({
      error: true,
      message: "Token não fornecido",
    });
  }

  const parts = authheader.split(" ");

  if (parts.length != 2) {
    return res.status(401).json({
      error: true,
      message: "Tipo do token invalido",
    });
  }

  const [Schema, token] = parts;

  if (Schema.indexOf("Bearer") !== 0) {
    return res.status(401).json({
      error: true,
      message: "Token mal formatado",
    });
  }

  jwt.verify(token, authconfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        erro: true,
        message: "Token expirado",
      });
    }

    req.userlogged = decoded;

    return next();
  });
};
