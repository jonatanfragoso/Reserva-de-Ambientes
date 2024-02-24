const express = require("express");
const rotas = require("./rotas");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(rotas);

app.listen(3000);
