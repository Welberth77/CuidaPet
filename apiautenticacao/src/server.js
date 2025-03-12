const express = require("express");

const authcontroller = require("./controllers/authcontroller");

const admincontroller = require("./controllers/admincontroller");

const app = express();

app.use(express.json());

app.use("/auth", authcontroller);

app.use("/admin", admincontroller);

app.get("/", (req, res) => {
  return res.json({
    error: false,
    message: "Acesso bem sucedido",
  });
});

app.listen(3200, () => {
  console.log("Server rodando");
});
