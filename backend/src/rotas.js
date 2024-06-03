const express = require("express");
const rotas = express();
const usuariosController = require("./controladores/usuarios");
const locaisController = require("./controladores/locais");
const autenticacaoMiddleware = require("./intermediarios/autenticacao");
const gestorMiddleware = require("./intermediarios/verificarGestor");
const agendamentosController = require("./controladores/agendamentos");
const gestorController = require("./controladores/gestor");

rotas.post("/login", usuariosController.login);
// rotas.post("/cadastrar-usuario", usuariosController.cadastrarUsuario);

rotas.use(autenticacaoMiddleware.verificarUsuarioLogado);

rotas.get("/locais", locaisController.listarLocais);
rotas.get("/local/:id", locaisController.obterLocal);
rotas.post(
  "/cadastrar-usuario",
  gestorMiddleware.verificarGestor,
  usuariosController.cadastrarUsuario
);
rotas.get("/obter-perfil", usuariosController.obterPerfil);

//Rotas de Gestor

rotas.post("/cadastrar-local", locaisController.cadastrarLocal);

rotas.get(
  "/usuarios",
  gestorMiddleware.verificarGestor,
  usuariosController.listarUsuarios
);

rotas.get(
  "/usuarios/:id",
  gestorMiddleware.verificarGestor,
  usuariosController.obterUsuario
);

rotas.put(
  "/editar-usuario/:id",
  gestorMiddleware.verificarGestor,
  gestorController.editarUsuarios
);

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

rotas.put(
  "/editar-usuarios",
  gestorMiddleware.verificarGestor,
  gestorController.editarUsuarios
);

//Rotas de professor
rotas.get(
  "/obter-proximos-agendamentos",
  usuariosController.listarProximosAgendamentos
);

rotas.get(
  "/obter-historico-agendamentos",
  usuariosController.listarHistoricoAgendamentos
);

rotas.put("/atualizar-perfil", usuariosController.atualizarPerfil);

rotas.post("/agendamentos", agendamentosController.reservarAmbiente);
rotas.put("/atualizar-senha", usuariosController.atualizarSenha);

module.exports = rotas;
