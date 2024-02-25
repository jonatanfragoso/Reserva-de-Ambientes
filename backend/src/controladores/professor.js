const knex = require("../conexao");
const senhaJWT = require("../senhaJWT");
const jwt = require("jsonwebtoken");
const moment = require("moment");

async function listarProximosAgendamentos(req, res) {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  const hoje = moment().format("YYYY-MM-DD");

  try {
    const listaAgendamentos = await knex("agendamentos")
      .where("id_usuario", id)
      .andWhere("situacao", "<>", "Negado")
      .andWhere("data_agendamento", ">=", hoje)
      .orderBy("data_agendamento")
      .orderBy("hora_inicio");

    return res.status(200).json(listaAgendamentos);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

async function listarHistoricoAgendamentos(req, res) {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  //   const hoje = moment().format("YYYY-MM-DD");

  try {
    const listaAgendamentos = await knex("agendamentos")
      .where("id_usuario", id)
      .orderBy("data_agendamento");

    return res.status(200).json(listaAgendamentos);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

module.exports = {
  listarProximosAgendamentos,
  listarHistoricoAgendamentos,
};
