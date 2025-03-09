const express = require("express");

const authcontroller = require("./controllers/authcontroller");

const app = express();

app.use("/auth", authcontroller);

app.get("/", (req, res) => {
  return res.json({
    error: false,
    message: "Acesso bem sucedido",
  });
});

app.listen(3200, () => {
  console.log("Server rodando");
});
