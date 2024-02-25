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

    let dataBanco;
    let verificaChoqueHorarioNaMesmaData;

    // CRIANDO VARIAVEIS PARA ARMAZENAR DADOS PARA IMPEDIR CONFLITOS DE HORARIOS
    const hora_inicio_inteira = hora_inicio.split(":");
    const hora_inicio_inteira_split = `${hora_inicio_inteira[0]}${hora_inicio_inteira[1]}`;
    const hora_inicio_inteira_formatada = parseInt(hora_inicio_inteira_split);

    const hora_fim_inteira = hora_fim.split(":");
    const hora_fim_inteira_split = `${hora_fim_inteira[0]}${hora_fim_inteira[1]}`;
    const hora_fim_inteira_formatada = parseInt(hora_fim_inteira_split);

    //CHECANDO SE HORA INICIAL É MAIOR-IGUAL A FINAL

    if (hora_inicio_inteira_formatada >= hora_fim_inteira_formatada) {
      return res.status(400).json({
        mensagem: "A hora final tem que ser maior que a inicial.",
      });
    }

    if (data_final < data_inicial) {
      return res.status(400).json({
        mensagem: "A data de inicio não pode ser menor que a final.",
      });
    }

    //VERIFICA SE O USUÁRIO SOLICITANTE JA TEM UM OUTRO HORÁRIO NESTA DATA E HORÁRIO
    let verificarChoqueHorarioDoUsuario;
    for (let j = 0; j <= semanas; j++) {
      minhaData = moment(dataFormatada, "D/M/YYYY")
        .locale("pt-br")
        .add(aux, "days")
        .format("L");
      dataBanco = minhaData.split("/");
      verificarChoqueHorarioDoUsuario = await knex("agendamentos")
        .where({
          data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
        })
        .andWhereBetween("hora_inicio", [hora_inicio, hora_fim])
        .andWhere("situacao", "<>", "Negado")
        .andWhere("id_usuario", user.id)
        .debug();

      if (verificarChoqueHorarioDoUsuario.length > 0) {
        return res.status(400).json({
          mensagem:
            "Você já tem uma solicitação para esta(s) data(s) e horário(s).",
        });
      }
      aux += 7;
    }
    aux = 0;

    for (let j = 0; j <= semanas; j++) {
      minhaData = moment(dataFormatada, "D/M/YYYY")
        .locale("pt-br")
        .add(aux, "days")
        .format("L");
      dataBanco = minhaData.split("/");
      verificarChoqueHorarioDoUsuario = await knex("agendamentos")
        .where({
          data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
        })
        .andWhereBetween("hora_fim", [hora_inicio, hora_fim])
        .andWhere("situacao", "<>", "Negado")
        .andWhere("id_usuario", user.id)
        .debug();

      if (verificarChoqueHorarioDoUsuario.length > 0) {
        return res.status(400).json({
          mensagem:
            "Você já tem uma solicitação para esta(s) data(s) e horário(s)",
        });
      }
      aux += 7;
    }

    aux = 0;

    if (repetir) {
      let verificarChoqueHorario_repetido;

      for (let j = 0; j <= semanas; j++) {
        minhaData = moment(dataFormatada, "D/M/YYYY")
          .locale("pt-br")
          .add(aux, "days")
          .format("L");
        dataBanco = minhaData.split("/");
        //VERIFICA SE ALGUM USUÁRIO TEM HORÁRIO AGENDADO NAQUELA DATA, HORÁRIO E LOCAL.
        verificarChoqueHorario_repetido = await knex("agendamentos")
          .where({
            data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
          })
          .andWhereBetween("hora_inicio", [hora_inicio, hora_fim])
          .andWhereBetween("hora_fim", [hora_inicio, hora_fim])
          .andWhere("situacao", "<>", "Negado")
          .andWhere("id_local", local)
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

    // QUANDO O AGENDAMENTO NÃO SE REPETIR!!!!!
    minhaData = moment(dataFormatada, "D/M/YYYY")
      .locale("pt-br")
      .add(aux, "days")
      .format("L");
    dataBanco = minhaData.split("/");

    const verificarChoqueHorario = await knex("agendamentos")
      .where({
        data_agendamento: `${dataBanco[2]}/${dataBanco[1]}/${dataBanco[0]}`,
      })
      .andWhereBetween("hora_inicio", [hora_inicio, hora_fim])
      .andWhereBetween("hora_fim", [hora_inicio, hora_fim])
      .andWhere("situacao", "<>", "Negado")
      .andWhere("id_local", local)
      .debug();

    if (verificarChoqueHorario.length > 0) {
      verificaChoqueHorarioNaMesmaData = await knex("agendamentos")
        .where("hora_inicio", hora_inicio)
        .orWhere("hora_inicio", hora_fim)
        .orWhere("hora_fim", hora_fim)
        .orWhere("hora_fim", hora_inicio);
      if (verificaChoqueHorarioNaMesmaData.length > 0) {
        return res.status(400).json({
          mensagem:
            "Ambiente já reservado entre o intervalo de datas solicitado.",
        });
      }
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
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  reservarAmbiente,
};
