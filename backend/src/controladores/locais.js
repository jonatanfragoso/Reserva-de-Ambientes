const pool = require("../conexao");

const listarLocais = async (req, res) => {
  try {
    const locais = await pool.query("select * from locais");

    const listaLocais = locais.rows;

    return res.status(200).json({ listaLocais: listaLocais });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listarLocais,
};
