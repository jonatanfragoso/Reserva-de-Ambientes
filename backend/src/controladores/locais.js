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

module.exports = {
  listarLocais,
  obterLocal,
};
