import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import styles from "./styles.module.scss";
import { AgendamentoProfessorType } from "../../../types/AgendamentoProfessorType";
import api from "../../../services/api";
import AgendamentosProfessor from "../../../components/AgendamentosProfessor";
import moment from "moment";

function MainProfessor() {
  const { handleGetToken } = useAuth();
  const token = handleGetToken();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState("");
  const [aux, setAux] = useState(0);

  const [agendamentosAceitos, setAgendamentosAceitos] = useState<
    AgendamentoProfessorType[]
  >([]);

  useEffect(() => {
    (async () => {
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      const response = await api.get<AgendamentoProfessorType[]>(
        `/obter-proximos-agendamentos?page=${page}`
      );
      const ultimaPagina = await api.get(
        "/obter-ultima-pagina-proximos-encontros"
      );
      setLastPage(`${ultimaPagina.data}`);
      setAgendamentosAceitos([...response.data]);
      setAux(response.data.length);
    })();
  }, [page, lastPage]);

  // const aux1 = new Date();
  // const aux2 = aux1.toString();
  // const aux3 = aux2.split(" ")[4].split(":");
  // const agora = `${aux3[0]}:${aux3[1]}`;

  const dataAtual = moment();
  const dataVencimento = moment("2021-02-01");

  console.log(dataAtual.isAfter(dataVencimento, "day")); // false

  if (aux == 0) {
    return (
      <div className={styles.container}>
        <div className={styles.divAgendamentos}>
          <h1>Próximos Encontros</h1>
          <h2>Não há reservas</h2>
        </div>
      </div>
    );
  }
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

export default MainProfessor;
