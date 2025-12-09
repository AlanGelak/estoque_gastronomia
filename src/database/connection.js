//Centraliza a conexão com o banco de dados MySQL através do Knex.
const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "estoque_gastronomia"
  }
});

module.exports = db;
