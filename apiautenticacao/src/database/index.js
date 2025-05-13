const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Cuidapet", "postgres", "123456", {
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

sequelize.sync({ force: true }); // `force: true` recria a tabela (cuidado!)
