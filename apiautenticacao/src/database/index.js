const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nome_do_banco", "usuario", "senha", {
  host: "localhost",
  dialect: "postgres",
  port: 5432, // porta padrão do PostgreSQL
  logging: false, // desativa logs de SQL se não quiser ver no console
});

// Testar a conexão
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com PostgreSQL estabelecida com sucesso.");
  })
  .catch((error) => {
    console.error("Falha ao conectar com PostgreSQL:", error);
  });

module.exports = sequelize;
