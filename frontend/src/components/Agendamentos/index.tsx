import { FormEvent } from "react";
import api from "../../services/api";
import { AgendamentoType } from "../../types/AgendamentoType";
import styles from "./styles.module.scss";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface IProps {
  agendamento: AgendamentoType;
}
function Agendamentos({ agendamento }: IProps) {
  const navigate = useNavigate();
  let repetir = true;

  //formatando data para padrão pt-br
  const data_inicio = moment(agendamento.data_inicio).format("DD-MM-YYYY");
  const data_fim = moment(agendamento.data_fim).format("DD-MM-YYYY");
  const data_inicio_aux = data_inicio.split("-");
  const data_fim_aux = data_fim.split("-");
  const data_inicio_formatada = `${data_inicio_aux[0]}/${data_inicio_aux[1]}/${data_inicio_aux[2]}`;
  const data_fim_formatada = `${data_fim_aux[0]}/${data_fim_aux[1]}/${data_fim_aux[2]}`;
  if (data_inicio_formatada === data_fim_formatada) {
    repetir = false;
  }
  //formatando hora para padrão pt-br
  const hora_inicio = agendamento.hora_inicio.split(":");
  const hora_fim = agendamento.hora_fim.split(":");
  const hora_inicio_formatada = `${hora_inicio[0]}:${hora_inicio[1]}`;
  const hora_fim_formatada = `${hora_fim[0]}:${hora_fim[1]}`;

  return (
    <div className={styles.container}>
      <p>{agendamento.id_usuario}</p>
      <p>{agendamento.id_local}</p>
      <p>{agendamento.dia_semana}</p>
      <p>Início: {hora_inicio_formatada}</p>
      <p>Término: {hora_fim_formatada}</p>
      {repetir ? (
        <div>
          <p>
            Data: {data_inicio_formatada} até {data_fim_formatada}
          </p>
        </div>
      ) : (
        <div>
          <p>Data: {data_inicio_formatada}</p>
        </div>
      )}
      <p>{agendamento.situacao}</p>
      {agendamento.situacao === "Pendente" && (
        <>
          <button onClick={handleSubmitAceitar}>Aceitar</button>
          <button onClick={handleSubmitNegar}>Negar</button>
        </>
      )}
    </div>
  );

  async function handleSubmitAceitar(e: FormEvent) {
    e.preventDefault();
    try {
      await api.post("/aceitar-solicitacoes", {
        data_inicial: data_inicio_formatada,
        data_final: data_fim_formatada,
        id_solicitante: agendamento.id_usuario,
        hora_inicio: hora_inicio_formatada,
        hora_fim: hora_fim_formatada,
        local: agendamento.id_local,
        dia_semana: agendamento.dia_semana,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitNegar(e: FormEvent) {
    e.preventDefault();
    try {
      await api.post("/negar-solicitacoes", {
        data_inicial: data_inicio_formatada,
        data_final: data_fim_formatada,
        id_solicitante: agendamento.id_usuario,
        hora_inicio: hora_inicio_formatada,
        hora_fim: hora_fim_formatada,
        local: agendamento.id_local,
        dia_semana: agendamento.dia_semana,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
}

export default Agendamentos;
