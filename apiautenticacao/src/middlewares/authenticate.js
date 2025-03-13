module.exports = (req, res, next) => {
  console.log("middleware");
  const authheader = req.headers.authorization;

  if (!authheader) {
    return res.status(401).json({
      error: true,
      message: "Token não fornecido",
    });
  }

  console.log(authheader);

  next();
};
