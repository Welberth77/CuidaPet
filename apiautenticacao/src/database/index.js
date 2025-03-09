const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://pauluciesar:paulu050224@apiauthmongo.nwgp7.mongodb.net/",
  {},
  (error) => {
    if (error) {
      console.log("Falha ao autenticar com mongobd");
      console.log(error);
      return;
    }
    console.log("Conexão com mongodb estável");
  }
);

mongoose.Promise = global.Promise;

module.exports = mongoose;
