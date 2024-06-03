const knex = require("../conexao");

const listarLocais = async (req, res) => {
  try {
    const locais = await knex("locais").debug();

    const listaLocais = locais;

    return res.status(200).json({ listaLocais });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const obterLocal = async (req, res) => {
  const { id } = req.params;
  try {
    const local = await knex("locais").where({ id: id }).first().debug();
    if (!local) {
      return res.status(404).json({ mensagem: "Local não encontrado" });
    }
    return res.status(200).json({ local });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const cadastrarLocal = async (req, res) => {
  try {
    const { descricao } = req.body;

    if (!descricao) {
      return res.status(400).json({ mensagem: "Nome do local é Obrigatório" });
    }

    const nomeValido = await knex("locais").whereILike("descricao", descricao);
    if (nomeValido.length > 0) {
      return res.status(400).json({ mensagem: "Local já cadastrado." });
    }

    await knex("locais").insert({
      descricao: descricao,
    });

    return res.status(201).json({ mensagem: "Local cadastrado com sucesso." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listarLocais,
  obterLocal,
  cadastrarLocal,
};
