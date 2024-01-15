const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "reserva_de_ambientes",
  },
});

module.exports = knex;
