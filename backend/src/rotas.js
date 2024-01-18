const express = require("express");
const rotas = express();
const usuariosController = require("./controladores/usuarios");
const locaisController = require("./controladores/locais");
const autenticacaoMiddleware = require("./intermediarios/autenticacao");
const gestorMiddleware = require("./intermediarios/verificarGestor");
const agendamentosController = require("./controladores/agendamentos");
const gestorController = require("./controladores/gestor");

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

rotas.get(
  "/obter-solicitacoes-pendentes",
  gestorMiddleware.verificarGestor,
  gestorController.obterSolicitacoesAgendamentosPendentes
);

rotas.get(
  "/obter-solicitacoes-negadas",

  gestorMiddleware.verificarGestor,
  gestorController.obterSolicitacoesAgendamentosNegadas
);

rotas.get(
  "/obter-solicitacoes-aceitas",
  gestorMiddleware.verificarGestor,
  gestorController.obterSolicitacoesAgendamentosAceitas
);

rotas.post(
  "/aceitar-solicitacoes",
  gestorMiddleware.verificarGestor,
  gestorController.aceitarSolicitacoes
);

rotas.post(
  "/negar-solicitacoes",
  gestorMiddleware.verificarGestor,
  gestorController.negarSolicitacoes
);

module.exports = rotas;
