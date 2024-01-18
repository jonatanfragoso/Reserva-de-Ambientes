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
    const nomeLocal = await knex("locais").where({ id: local }).first();
    //função que calcula a diferença de dias entre duas datas
    let date1 = new Date(
      `${dataQuebrada[1]}/${dataQuebrada[0]}/${dataQuebrada[2]}`
    );
    let date2 = new Date(
      `${dataQuebrada2[1]}/${dataQuebrada2[0]}/${dataQuebrada2[2]}`
    );
    const n_dia_semana = date1.getDay();
    const dia_semana = moment()
      .locale("pt-br")
      .day(n_dia_semana)
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

    if (repetir) {
      let verificarChoqueHorario_repetido;
      for (let j = 0; j <= semanas; j++) {
        minhaData = moment(dataFormatada, "D/M/YYYY")
          .locale("pt-br")
          .add(aux, "days")
          .format("L");
        dataBanco = minhaData.split("/");

        verificarChoqueHorario_repetido = await knex("agendamentos")
          .whereBetween("hora_inicio", [hora_inicio, hora_fim])
          .andWhere({
            data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
          })
          .andWhere("situacao", "<>", "Negado")
          .debug();
        if (verificarChoqueHorario_repetido.length > 0) {
          return res.status(400).json({
            mensagem:
              "Ambiente já reservado entre o intervalo de datas solicitado.",
          });
        }
        aux += 7;
      }
      aux = 0;
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
          dia_semana: dia_semana,
        });
        aux += 7;
      }
      return res.status(201).json({
        dia_semana: dia_semana,
        hora_incio: hora_inicio,
        hora_fim: hora_fim,
        local: nomeLocal.descricao,
        data_inicial: data_inicial,
        data_final: data_final,
      });
    }
    minhaData = moment(dataFormatada, "D/M/YYYY")
      .locale("pt-br")
      .add(aux, "days")
      .format("L");
    dataBanco = minhaData.split("/");

    const verificarChoqueHorario = await knex("agendamentos")
      .whereBetween("hora_inicio", [hora_inicio, hora_fim])
      .andWhere({
        data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
      })
      .andWhere("situacao", "<>", "Negado");
    if (verificarChoqueHorario.length > 0) {
      return res.status(400).json({
        mensagem: "Já existe uma reserva nesta data e hora para este local.",
      });
    }

    agendamento = await knex("agendamentos").insert({
      hora_inicio: hora_inicio,
      hora_fim: hora_fim,
      data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
      id_usuario: user.id,
      id_gestor: null,
      id_local: local,
      situacao: "Pendente",
      dia_semana: dia_semana,
    });
    return res.status(201).json({
      dia_semana: dia_semana,
      hora_incio: hora_inicio,
      hora_fim: hora_fim,
      local: nomeLocal.descricao,
      data: data_inicial,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  reservarAmbiente,
};
