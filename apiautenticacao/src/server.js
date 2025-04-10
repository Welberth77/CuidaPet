const express = require("express");
const cors = require("cors"); // Adicionando CORS para permitir requisições do frontend
const authcontroller = require("./controllers/authcontroller");
const usercontroller = require("./controllers/usercontroller"); // Novo controller para operações de usuário
const admincontroller = require("./controllers/admincontroller");
const authenticatemiddleware = require("./middlewares/authenticate");

const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authcontroller);
app.use("/user", authenticatemiddleware, usercontroller); // Novas rotas para operações de usuário
app.use("/admin", authenticatemiddleware, admincontroller);

app.get("/", (req, res) => {
  return res.json({
    error: false,
    message: "Acesso bem sucedido",
  });
});

app.listen(3200, () => {
  console.log("Server rodando");
});
