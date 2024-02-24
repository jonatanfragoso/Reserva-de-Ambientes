const senhaJWT = require("../senhaJWT");
const jwt = require("jsonwebtoken");
const knex = require("../conexao");
const verificarUsuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("alo");
    return res.status(401).json({ mensagem: "Não autorizado." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, senhaJWT);
    const usuario = await knex("usuarios").where({ id: id });

    if (!usuario) {
      return res.status(401).json({ mensagem: "Não autorizado." });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Não autorizado." });
  }
};

module.exports = {
  verificarUsuarioLogado,
};
