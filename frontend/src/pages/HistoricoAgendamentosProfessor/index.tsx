import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { AgendamentoProfessorType } from "../../types/AgendamentoProfessorType";
import api from "../../services/api";
import styles from "./styles.module.scss";
import HistoricoProfessor from "../../components/HistoricoProfessor";

function HistoricoAgendamentosProfessor() {
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
        "/obter-historico-agendamentos"
      );

      setAgendamentosAceitos([...response.data]);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.divAgendamentos}>
        <h1>Histórico de Agendamentos</h1>

        {agendamentosAceitos.map((agendamento, index) => (
          <HistoricoProfessor
            agendamento={agendamento}
            key={index}
          ></HistoricoProfessor>
        ))}
      </div>
    </div>
  );
}

export default HistoricoAgendamentosProfessor;
