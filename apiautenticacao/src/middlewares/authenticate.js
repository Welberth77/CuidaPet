module.exports = (req, res, next) => {
  console.log("middleware");
  const authheader = req.headers.authorization;

  console.log(authheader);

  next();
};
