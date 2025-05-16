const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("cuidapet", "postgres", "123456", {
  host: "172.20.10.5",
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

// sequelize.sync({ force: false }); // `force: true` recria a tabela (cuidado!)
