module.exports = (req, res, next) => {
  console.log("middleware");
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

  next();
};
