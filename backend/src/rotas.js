const express = require("express");
const rotas = express();
const usuariosController = require("./controladores/usuarios");
const locaisController = require("./controladores/locais");
const autenticacaoMiddleware = require("./intermediarios/autenticacao");
const gestorMiddleware = require("./intermediarios/verificarGestor");
const agendamentosController = require("./controladores/agendamentos");

rotas.post("/login", usuariosController.login);

rotas.use(autenticacaoMiddleware.verificarUsuarioLogado);

rotas.get("/usuarios", usuariosController.listarUsuarios);
rotas.get("/usuario/:id", usuariosController.obterUsuario);
rotas.get("/locais", locaisController.listarLocais);
rotas.get("/local/:id", locaisController.obterLocal);
rotas.post(
  "/cadastrar-usuario",
  gestorMiddleware.verificarGestor,
  usuariosController.cadastrarUsuario
);
rotas.get("/obter-perfil", usuariosController.obterPerfil);

rotas.post("/agendamentos", agendamentosController.reservarAmbiente);

module.exports = rotas;
