const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://pauluciesar:paulu050224@apiauthmongo.nwgp7.mongodb.net/?retryWrites=true&w=majority&appName=APIauthmongo"
  )
  .then(() => {
    console.log("Conexão com MongoDB estável");
  })
  .catch((error) => {
    console.log("Falha ao autenticar com MongoDB");
    console.log(error);
  });

module.exports = mongoose;

mongoose.Promise = global.Promise;
