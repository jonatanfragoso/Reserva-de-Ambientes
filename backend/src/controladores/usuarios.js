const knex = require("../conexao");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const senhaJWT = require("../senhaJWT");
const moment = require("moment");

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await knex("usuarios").where({ email: email }).first();
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(404).json({ mensagem: "Usuário ou senha inválidos." });
    }

    if (usuario.ativo === false) {
      return res.status(404).json({ mensagem: "Usuario Desativado." });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        id_gestor: usuario.id_gestor,
        id_funcao: usuario.id_funcao,
      },
      senhaJWT,
      { expiresIn: "8h" }
    );
    const { senha: _, ...usuarioAutenticado } = usuario;

    return res.status(200).json({ usuario: usuarioAutenticado, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const listarUsuarios = async (req, res) => {
  const { filtro } = req.query;
  const { page } = req.query;
  const offset = (page - 1) * 5;
  const limit = 5;

  try {
    console.log(filtro);
    if (filtro) {
      const usuarios = await knex("usuarios")
        .where("nome", "ilike", `%${filtro}%`)
        .orWhere("email", "ilike", `%${filtro}%`)
        .orWhere("matricula", "ilike", `%${filtro}%`)
        .limit(limit)
        .offset(offset);
      return res.status(200).json(usuarios);
    }
    const usuarios = await knex("usuarios").debug().limit(limit).offset(offset);

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterUsuario = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const usuario = await knex("usuarios").where({ id: id }).first().debug();
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    return res.status(200).json({ usuario });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterPerfil = async (req, res) => {
  return res.status(200).json(req.usuario[0]);
};

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, telefone, matricula, id_funcao, id_gestor } =
    req.body;

  if (
    !nome ||
    !email ||
    !senha ||
    !telefone ||
    !matricula ||
    !id_funcao ||
    !id_gestor
  ) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }
  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const emailValido = await knex("usuarios").where({ email: email });
    if (emailValido.length > 0) {
      return res.status(400).json({ mensagem: "Email já cadastrado." });
    }

    const matriculaValida = await knex("usuarios").where({
      matricula: matricula,
    });
    if (matriculaValida.length > 0) {
      return res.status(400).json({ mensagem: "Matrícula já cadastrada." });
    }

    await knex("usuarios").insert({
      nome: nome,
      email: email,
      senha: senhaCriptografada,
      telefone: telefone,
      matricula: matricula,
      id_funcao: id_funcao,
      id_gestor: id_gestor,
      ativo: true,
    });

    return res.status(201).json({ mensagem: "Cadastrado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

// Última página da listagem dpróximas aulas de cada professor ou Técnico
const obterLastPageProximosEncontros = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  const hoje = moment().format("YYYY-MM-DD");
  const limit = 5;
  try {
    const contador = await knex("agendamentos")
      .where("id_usuario", id)
      .andWhere("situacao", "<>", "Negado")
      .andWhere("data_agendamento", ">=", hoje);
    const lastPage = parseInt(contador.length / limit);
    return res.status(200).json(lastPage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const listarProximosAgendamentos = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  const hoje = moment().format("YYYY-MM-DD");
  const { page } = req.query;
  const offset = (page - 1) * 5;
  const limit = 5;

  try {
    const listaAgendamentos = await knex("agendamentos")
      .where("id_usuario", id)
      .andWhere("situacao", "<>", "Negado")
      .andWhere("data_agendamento", ">=", hoje)
      .orderBy("data_agendamento")
      .orderBy("hora_inicio")
      .limit(limit)
      .offset(offset);

    return res.status(200).json(listaAgendamentos);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

// Última página da listagem dpróximas aulas de cada professor ou Técnico
const obterLastPageHistoricoAgendamentos = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  const limit = 5;
  try {
    const contador = await knex("agendamentos").where("id_usuario", id);
    const lastPage = parseInt(contador.length / limit);
    return res.status(200).json(lastPage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const listarHistoricoAgendamentos = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  const { page } = req.query;
  const offset = (page - 1) * 5;
  const limit = 5;

  //   const hoje = moment().format("YYYY-MM-DD");

  try {
    const listaAgendamentos = await knex("agendamentos")
      .where("id_usuario", id)
      .orderBy("data_agendamento")
      .limit(limit)
      .offset(offset);
    return res.status(200).json(listaAgendamentos);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const atualizarSenha = async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  try {
    const usuario = await knex("usuarios").where({ id: id }).first();
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res
        .status(404)
        .json({ mensagem: "A senha atual está incorreta." });
    }
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
    await knex("usuarios").where({ id: id }).update({
      senha: senhaCriptografada,
    });

    return res.status(201).json({ mensagem: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const atualizarPerfil = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { id } = jwt.verify(token, senhaJWT);
  try {
    const { nome, email, telefone } = req.body;

    if ((!nome, !email, !telefone)) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios." });
    }

    const emailValido = await knex("usuarios").where({ email: email });
    const emaildoMesmoUsuario = await knex("usuarios")
      .where({ email: email })
      .andWhere({ id: id });
    if (emailValido.length > 0 && emaildoMesmoUsuario.length == 0) {
      return res
        .status(400)
        .json({ mensagem: "Este email já está sendo utilizado." });
    }

    await knex("usuarios").where({ id: id }).update({
      nome: nome,
      email: email,
      telefone: telefone,
    });
    return res.status(201).json({ mensagem: "Perfil atualizado com sucesso!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listarUsuarios,
  obterUsuario,
  cadastrarUsuario,
  login,
  obterPerfil,
  atualizarPerfil,
  listarHistoricoAgendamentos,
  listarProximosAgendamentos,
  atualizarSenha,
  obterLastPageProximosEncontros,
  obterLastPageHistoricoAgendamentos,
};
