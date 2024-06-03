import { FormEvent, useEffect, useState } from "react";
import api from "../../services/api";
import styles from "./styles.module.scss";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
registerLocale("pt-BR", ptBR);

function SolicitarAgendamento() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [idLocal, setIdLocal] = useState(0);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [repetir, setRepetir] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startEndDate, setStartEndDate] = useState(new Date());
  const [hoje, setHoje] = useState(moment().locale("en").format("L"));

  const navigate = useNavigate();
  const { handleGetToken } = useAuth();
  const token = handleGetToken();

  useEffect(() => {
    (async () => {
      setDataInicio(moment(startDate).format("DD/MM/yyyy"));
      setDataFim(moment(startDate).format("DD/MM/yyyy"));
      setStartEndDate(startDate);
      setStartDate(startDate);
    })();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formatHoje = hoje.split("/");
    const data_solicitacao = `${formatHoje[2]}/${formatHoje[1]}/${formatHoje[0]}`;
    setHoje(data_solicitacao);

    try {
      console.log("data inicio:", dataInicio);
      console.log("data fim: ", dataFim);
      console.log(horaInicio);
      console.log(horaFim);
      console.log(idLocal);
      console.log(repetir);

      // if (!dataInicio || !dataFim || idLocal || horaFim || horaInicio) {
      //   throw new Error("Todos os campos são obrigatórios.");
      // }

      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }

      await api.post("/agendamentos", {
        data_inicial: dataInicio,
        data_final: dataFim,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        local: idLocal,
        repetir: repetir,
        data_solicitacao: data_solicitacao,
      });

      navigate("/main-professor");
    } catch (error) {
      console.log(error);
    }
  }

  function handleDatasInicio(date) {
    setDataInicio(moment(date).format("DD/MM/yyyy"));
    setDataFim(moment(date).format("DD/MM/yyyy"));
    setStartEndDate(date);
    setStartDate(date);
  }

  function handleDatasFim(date) {
    setDataFim(moment(date).format("DD/MM/yyyy"));
    setStartEndDate(date);
  }

  function handleHoraInicialFinal(hora: string) {
    setHoraInicio(hora);
    if (hora === "07:30") {
      setHoraFim("09:10");
    }
    if (hora === "09:20") {
      setHoraFim("11:00");
    }
    if (hora === "11:10") {
      setHoraFim("13:20");
    }
    if (hora === "13:30") {
      setHoraFim("14:50");
    }
    if (hora === "15:00") {
      setHoraFim("16:40");
    }
  }

  // function handleCancelar() {
  //   // setDataInicio(moment(startDate).format("DD/MM/yyyy"));
  //   // setDataFim(moment(startDate).format("DD/MM/yyyy"));
  //   setStartEndDate(startDate);
  //   setStartDate(startDate);
  //   setHoraInicio("");
  //   setHoraFim("");
  //   setRepetir(false);
  // }

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Solicitar Reserva</h1>
      </div>
      <div className={styles.divForm}>
        <form onSubmit={handleSubmit}>
          <p>DATA INCIAL:</p>
          <ReactDatePicker
            selected={startDate}
            locale="pt-BR"
            dateFormat="dd/MM/yyyy"
            onChange={(date) => handleDatasInicio(date)}
          ></ReactDatePicker>
          <p>HORÁRIO: </p>
          <select
            name="Horarios"
            required
            onChange={(hora) => handleHoraInicialFinal(hora.target.value)}
          >
            <option value=""></option>
            <option value="07:30">07:30 às 09:10</option>
            <option value="09:20">09:20 às 11:00</option>
            <option value="11:10">11:10 às 13:20</option>
            <option value="13:30">13:30 às 14:50</option>
            <option value="15:00">15:00 às 16:40</option>
          </select>
          <p>REPETIR HORÁRIO: </p>
          <input type="checkbox" onChange={() => setRepetir(!repetir)} />
          {repetir && (
            <>
              <p>DATA FINAL:</p>
              <ReactDatePicker
                locale="pt-BR"
                selected={startEndDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => handleDatasFim(date)}
              ></ReactDatePicker>
            </>
          )}
          <p>LOCAL: </p>
          <select
            name="local"
            required
            onChange={(e) => setIdLocal(parseInt(e.target.value))}
          >
            <option value=""></option>
            <option value={1}>Lab 1</option>
            <option value={2}>Lab 2</option>
            <option value={3}>Lab 3</option>
            <option value={4}>Lab 4</option>
            <option value={12}>Lab 5</option>
          </select>
          <div>
            <div className={styles.divBotoes}>
              <button className={styles.btnVerde}>Solicitar</button>
              {/* <button className={styles.btnVermelho}>Cancelar</button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SolicitarAgendamento;
