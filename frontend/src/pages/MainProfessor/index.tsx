import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import styles from "./styles.module.scss";
import { AgendamentoProfessorType } from "../../types/AgendamentoProfessorType";
import api from "../../services/api";
import AgendamentosProfessor from "../../components/AgendamentosProfessor";
import moment from "moment";

function MainProfessor() {
  const { handleGetToken } = useAuth();
  const token = handleGetToken();
  const [agendamentosAceitos, setAgendamentosAceitos] = useState<
    AgendamentoProfessorType[]
  >([]);

  useEffect(() => {
    (async () => {
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      const response = await api.get<AgendamentoProfessorType[]>(
        "/obter-proximos-agendamentos"
      );

      setAgendamentosAceitos([...response.data]);
    })();
  }, []);

  // const aux1 = new Date();
  // const aux2 = aux1.toString();
  // const aux3 = aux2.split(" ")[4].split(":");
  // const agora = `${aux3[0]}:${aux3[1]}`;

  const dataAtual = moment();
  const dataVencimento = moment("2021-02-01");

  console.log(dataAtual.isAfter(dataVencimento, "day")); // false

  return (
    <div className={styles.container}>
      <div className={styles.divAgendamentos}>
        <h1>Próximos Encontros</h1>

        {agendamentosAceitos.map((agendamento, index) => (
          <AgendamentosProfessor
            agendamento={agendamento}
            key={index}
          ></AgendamentosProfessor>
        ))}
      </div>
    </div>
  );
}

export default MainProfessor;
