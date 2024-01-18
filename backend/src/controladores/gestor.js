const knex = require("../conexao");
const senhaJWT = require("../senhaJWT");
const jwt = require("jsonwebtoken");

const obterSolicitacoesAgendamentosPendentes = async (req, res) => {
  try {
    const listaSolicitacoes = await knex("agendamentos")
      .select(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao"
      )
      .min("data_agendamento", { as: "data_inicio" })
      .max("data_agendamento", { as: "data_fim" })
      .groupBy(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao"
      )
      .whereILike("situacao", "pendente");
    return res.status(200).json(listaSolicitacoes);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterSolicitacoesAgendamentosNegadas = async (req, res) => {
  try {
    const listaSolicitacoes = await knex("agendamentos")
      .select(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao"
      )
      .min("data_agendamento", { as: "data_inicio" })
      .max("data_agendamento", { as: "data_fim" })
      .groupBy(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao"
      )
      .whereILike("situacao", "negado");
    return res.status(200).json(listaSolicitacoes);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterSolicitacoesAgendamentosAceitas = async (req, res) => {
  try {
    const listaSolicitacoes = await knex("agendamentos")
      .select(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao"
      )
      .min("data_agendamento", { as: "data_inicio" })
      .max("data_agendamento", { as: "data_fim" })
      .groupBy(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao"
      )
      .whereILike("situacao", "aceito");
    return res.status(200).json(listaSolicitacoes);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const aceitarSolicitacoes = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);

  const {
    data_inicial,
    data_final,
    id_solicitante,
    hora_inicio,
    hora_fim,
    dia_semana,
    local,
  } = req.body;

  if (
    !data_inicial ||
    !data_final ||
    !id_solicitante ||
    !hora_inicio ||
    !hora_fim ||
    !dia_semana ||
    !local
  ) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  let dataQuebrada = data_inicial.split("/");
  let dataQuebrada2 = data_final.split("/");
  let data_inicial_formatada = `${dataQuebrada[2]}/${dataQuebrada[1]}/${dataQuebrada[0]}`;
  let data_final_formatada = `${dataQuebrada2[2]}/${dataQuebrada2[1]}/${dataQuebrada2[0]}`;
  try {
    const nome_gestor = await knex("usuarios").select("nome").where({ id: id });
    await knex("agendamentos")
      .update({
        nome_gestor: nome_gestor[0].nome,
        id_gestor: id,
        situacao: "Aceito",
      })
      .where("data_agendamento", ">=", data_inicial_formatada)
      .andWhere("data_agendamento", "<=", data_final_formatada)
      .andWhere("hora_inicio", ">=", hora_inicio)
      .andWhere("hora_fim", "<=", hora_fim)
      .andWhere({ id_usuario: id_solicitante })
      .andWhere({ id_local: local })
      .andWhereILike("situacao", "Pendente")
      .andWhereILike("dia_semana", dia_semana);

    return res.status(204).json();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const negarSolicitacoes = async (req, res) => {
  const { id } = req.usuario;
  const {
    data_inicial,
    data_final,
    id_solicitante,
    hora_inicio,
    hora_fim,
    dia_semana,
  } = req.body;

  if (
    !data_inicial ||
    !data_final ||
    !id_solicitante ||
    !hora_inicio ||
    !hora_fim ||
    !dia_semana
  ) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }
  try {
    await knex("agendamentos")
      .update({
        id_gestor: id,
        situacao: "Negado",
      })
      .where("data_agendamento", ">=", data_inicial)
      .andWhere("data_agendamento", "<=", data_final)
      .andWhere("hora_inicio", ">=", hora_inicio)
      .andWhere("hora_fim", "<=", hora_fim)
      .andWhere({ id_usuario: id_solicitante })
      .andWhereILike("dia_semana", dia_semana);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  obterSolicitacoesAgendamentosPendentes,
  obterSolicitacoesAgendamentosAceitas,
  obterSolicitacoesAgendamentosNegadas,
  aceitarSolicitacoes,
  negarSolicitacoes,
};
