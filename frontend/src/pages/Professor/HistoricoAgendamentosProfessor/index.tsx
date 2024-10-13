import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { AgendamentoProfessorType } from "../../../types/AgendamentoProfessorType";
import api from "../../../services/api";
import styles from "./styles.module.scss";
import HistoricoProfessor from "../../../components/HistoricoProfessor";

function HistoricoAgendamentosProfessor() {
  const { handleGetToken } = useAuth();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState("");

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
        `/obter-historico-agendamentos?page=${page}`
      );
      const ultimaPagina = await api.get(
        "/obter-ultima-pagina-historico-agendamentos"
      );
      setLastPage(`${ultimaPagina.data}`);

      setAgendamentosAceitos([...response.data]);
    })();
  }, [page, lastPage]);

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
        <div className={styles.btnPages}>
          {Array(Number(lastPage) + 1)
            .fill("")
            .map((_, index) => {
              return (
                <button key={index} onClick={() => setPage(index + 1)}>
                  {index + 1}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default HistoricoAgendamentosProfessor;
