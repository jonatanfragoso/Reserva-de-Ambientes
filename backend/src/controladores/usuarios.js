const knex = require("../conexao");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const senhaJWT = require("../senhaJWT");

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
  try {
    const usuarios = await knex("usuarios").debug();

    const listaUsuarios = usuarios;

    return res.status(200).json({ listaUsuarios });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await knex("usuarios").where({ id: id }).first().debug();
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    return res.status(200).json({ usuario });
  } catch (error) {
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
      return res.status(400).json({ mensagem: "Matricula já cadastrada." });
    }

    const novoUsuario = await knex("usuarios").insert({
      nome: nome,
      email: email,
      senha: senhaCriptografada,
      telefone: telefone,
      matricula: matricula,
      id_funcao: id_funcao,
      id_gestor: id_gestor,
    });

    return res.status(201).json({ mensagem: "Cadastrado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listarUsuarios,
  obterUsuario,
  cadastrarUsuario,
  login,
  obterPerfil,
};
