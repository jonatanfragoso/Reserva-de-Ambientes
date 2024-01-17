const knex = require("../conexao");
const moment = require("moment");
const momento = moment();

const reservarAmbiente = async (req, res) => {
  const usuario = req.usuario;
  const { senha: _, ...user } = usuario[0];
  const { data_inicial, data_final, hora_inicio, hora_fim, local, repetir } =
    req.body;

  let dataQuebrada = data_inicial.split("/");
  let dataQuebrada2 = data_final.split("/");

  try {
    if (repetir) {
      const nomeLocal = await knex("locais").where({ id: local }).first();
      //função que calcula a diferença de dias entre duas datas
      let date1 = new Date(
        `${dataQuebrada[1]}/${dataQuebrada[0]}/${dataQuebrada[2]}`
      );
      let date2 = new Date(
        `${dataQuebrada2[1]}/${dataQuebrada2[0]}/${dataQuebrada2[2]}`
      );
      const n_dia_da_semana = date1.getDay();
      const dia_da_semana = moment()
        .locale("pt-br")
        .day(n_dia_da_semana)
        .format("dddd");
      let timeDiff = Math.abs(date2.getTime() - date1.getTime());
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      //função que fomata uma data para dia/mes/ano
      dataFormatada = date1.toLocaleDateString("pt-BR", { timeZone: "UTC" });

      let semanas = parseInt(diffDays / 7);

      //função que aficiona dias a uma data
      let minhaData;
      let aux = 0;
      minhaData = moment(dataFormatada, "D/M/YYYY")
        .locale("pt-br")
        .add(aux, "days")
        .format("L");

      let agendamento;
      let dataBanco;
      let agendamentos = [];
      agendamentos.push({ alo: "alo" });
      for (let i = 0; i <= semanas; i++) {
        minhaData = moment(dataFormatada, "D/M/YYYY")
          .locale("pt-br")
          .add(aux, "days")
          .format("L");
        dataBanco = minhaData.split("/");

        agendamento = await knex("agendamentos").insert({
          hora_inicio: hora_inicio,
          hora_fim: hora_fim,
          data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
          id_usuario: user.id,
          id_gestor: null,
          id_local: local,
          situacao: "Pendente",
        });
        aux += 7;
      }
      return res.status(201).json({
        dia_da_semana: dia_da_semana,
        hora_incio: hora_inicio,
        hora_fim: hora_fim,
        local: nomeLocal.descricao,
        data_inicial: data_inicial,
        data_final: data_final,
      });
    } else if (!repetir) {
      agendamento = await knex("agendamentos").insert({
        hora_inicio: hora_inicio,
        hora_fim: hora_fim,
        data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
        id_usuario: user.id,
        id_gestor: null,
        id_local: local,
        situacao: "Pendente",
      });
      return res.status(201).json({
        dia_da_semana: dia_da_semana,
        hora_incio: hora_inicio,
        hora_fim: hora_fim,
        local: nomeLocal.descricao,
        data: data_inicial,
      });
    }

    return res.status(200).json(agendamentos);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  reservarAmbiente,
};
