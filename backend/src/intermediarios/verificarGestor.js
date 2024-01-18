const senhaJWT = require("../senhaJWT");
const jwt = require("jsonwebtoken");
const knex = require("../conexao");

const verificarGestor = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, senhaJWT);
    const usuario = await knex("usuarios").where({ id: id }).first();

    if (usuario.id_gestor != 1) {
      return res
        .status(401)
        .json({ mensagem: "Não autorizado. Você não é um gestor." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  verificarGestor,
};
