const express = require("express");
const rotas = express();
const usuarios = require("./controladores/usuarios");
const locais = require("./controladores/locais");

rotas.get("/usuarios", usuarios.listarUsuarios);
rotas.get("/usuario/:id", usuarios.obterUsuario);
rotas.get("/locais", locais.listarLocais);
rotas.post("/cadastrar-usuario", usuarios.cadastrarUsuario);

module.exports = rotas;
