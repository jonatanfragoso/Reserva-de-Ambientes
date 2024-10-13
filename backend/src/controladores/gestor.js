const knex = require("../conexao");
const senhaJWT = require("../senhaJWT");
const jwt = require("jsonwebtoken");

// Última página da listagem de usuários (para edição)
const obterLastPageUsuarios = async (req, res) => {
  const limit = 5;
  try {
    const contador = await knex("usuarios");
    const lastPage = parseInt(contador.length / limit);
    return res.status(200).json(lastPage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

// Última página da listagem de agendamentos pendentes
const obterLastPage = async (req, res) => {
  const limit = 5;
  try {
    const contador = await knex("reservas").whereILike("situacao", "pendente");
    const lastPage = parseInt(contador.length / limit);
    return res.status(200).json(lastPage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterSolicitacoesAgendamentosPendentes = async (req, res) => {
  const { page } = req.query;
  const offset = (page - 1) * 5;
  const limit = 5;
  try {
    const listaSolicitacoes = await knex("reservas")
      .select(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao",
        "data_inicio",
        "data_fim"
      )
      .whereILike("situacao", "pendente")
      .limit(limit)
      .offset(offset);
    return res.status(200).json(listaSolicitacoes);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterSolicitacoesAgendamentosNegadas = async (req, res) => {
  try {
    const listaSolicitacoes = await knex("reservas")
      .select(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao",
        "data_inicio",
        "data_fim"
      )
      // .min("data_agendamento", { as: "data_inicio" })
      // .max("data_agendamento", { as: "data_fim" })
      // .groupBy(
      //   "id_usuario",
      //   "id_local",
      //   "dia_semana",
      //   "hora_inicio",
      //   "hora_fim",
      //   "situacao"
      // )
      .whereILike("situacao", "negado");
    return res.status(200).json(listaSolicitacoes);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterSolicitacoesAgendamentosAceitas = async (req, res) => {
  try {
    const listaSolicitacoes = await knex("reservas")
      .select(
        "id_usuario",
        "id_local",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "situacao",
        "data_inicio",
        "data_fim"
      )
      // .min("data_agendamento", { as: "data_inicio" })
      // .max("data_agendamento", { as: "data_fim" })
      // .groupBy(
      //   "id_usuario",
      //   "id_local",
      //   "dia_semana",
      //   "hora_inicio",
      //   "hora_fim",
      //   "situacao"
      // )
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
    data_solicitacao,
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

    await knex("reservas")
      .update({
        nome_gestor: nome_gestor[0].nome,
        id_gestor: id,
        situacao: "Aceito",
      })

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

const obterPerfil = async (req, res) => {
  return res.status(200).json(req.usuario[0]);
};

const negarSolicitacoes = async (req, res) => {
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
        situacao: "Negado",
      })
      .where("data_agendamento", ">=", data_inicial_formatada)
      .andWhere("data_agendamento", "<=", data_final_formatada)
      .andWhere("hora_inicio", ">=", hora_inicio)
      .andWhere("hora_fim", "<=", hora_fim)
      .andWhere({ id_usuario: id_solicitante })
      .andWhere({ id_local: local })
      .andWhereILike("situacao", "Pendente")
      .andWhereILike("dia_semana", dia_semana);

    await knex("reservas")
      .update({
        nome_gestor: nome_gestor[0].nome,
        id_gestor: id,
        situacao: "Negado",
      })
      .andWhere("hora_inicio", ">=", hora_inicio)
      .andWhere("hora_fim", "<=", hora_fim)
      .andWhere({ id_usuario: id_solicitante })
      .andWhere({ id_local: local })
      .andWhereILike("situacao", "Pendente")
      .andWhereILike("dia_semana", dia_semana);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const editarUsuarios = async (req, res) => {
  const { id } = req.params;

  const { nome, email, telefone, matricula, id_funcao, id_gestor, ativo } =
    req.body;

  console.log(
    nome,
    email,
    telefone,
    matricula,
    id_funcao,
    id_gestor,
    ativo,
    id
  );

  if (!nome || !email || !telefone || !matricula || !id_funcao || !id_gestor) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  try {
    await knex("usuarios").where("id", id).update({
      nome: nome,
      email: email,
      telefone: telefone,
      matricula: matricula,
      id_funcao: id_funcao,
      id_gestor: id_gestor,
      ativo: ativo,
    });

    return res
      .status(201)
      .json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  obterSolicitacoesAgendamentosPendentes,
  obterSolicitacoesAgendamentosAceitas,
  obterSolicitacoesAgendamentosNegadas,
  aceitarSolicitacoes,
  negarSolicitacoes,
  obterPerfil,
  editarUsuarios,
  obterLastPage,
  obterLastPageUsuarios,
};
