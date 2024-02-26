import { AgendamentoProfessorType } from "../../types/AgendamentoProfessorType";
import styles from "./styles.module.scss";
import moment from "moment";

interface IProps {
  agendamento: AgendamentoProfessorType;
}
function AgendamentosProfessor({ agendamento }: IProps) {
  //formatando data para padrão pt-br
  const data_inicio = moment(agendamento.data_agendamento).format("DD-MM-YYYY");
  const data_inicio_aux = data_inicio.split("-");
  const data_inicio_formatada = `${data_inicio_aux[0]}/${data_inicio_aux[1]}/${data_inicio_aux[2]}`;

  //formatando hora para padrão pt-br
  const hora_inicio = agendamento.hora_inicio.split(":");
  const hora_fim = agendamento.hora_fim.split(":");
  const hora_inicio_formatada = `${hora_inicio[0]}:${hora_inicio[1]}`;
  const hora_fim_formatada = `${hora_fim[0]}:${hora_fim[1]}`;

  return (
    <div className={styles.container}>
      <p>{agendamento.id_local}</p>
      <p>{agendamento.dia_semana}</p>
      <p>Início: {hora_inicio_formatada}</p>
      <p>Término: {hora_fim_formatada}</p>
      <p>Data: {data_inicio_formatada}</p>
    </div>
  );
}

export default AgendamentosProfessor;
