const express = require("express");
const rotas = express();
const usuariosController = require("./controladores/usuarios");
const locaisController = require("./controladores/locais");
const autenticacaoMiddleware = require("./intermediarios/autenticacao");
const gestorMiddleware = require("./intermediarios/verificarGestor");
const agendamentosController = require("./controladores/agendamentos");
const gestorController = require("./controladores/gestor");
const professorController = require("./controladores/professor");

rotas.post("/login", usuariosController.login);
rotas.post("/cadastrar-usuario", usuariosController.cadastrarUsuario);

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
//Rotas de Gestor
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

//Rotas de professor
rotas.get(
  "/obter-proximos-agendamentos",
  professorController.listarProximosAgendamentos
);

rotas.get(
  "/obter-historico-agendamentos",
  professorController.listarHistoricoAgendamentos
);

module.exports = rotas;
