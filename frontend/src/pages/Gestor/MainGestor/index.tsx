import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import styles from "./styles.module.scss";
import { AgendamentoType } from "../../../types/AgendamentoType";
import api from "../../../services/api";
import Agendamentos from "../../../components/Agendamentos";
import { set } from "date-fns";

function MainGestor() {
  const { handleGetToken } = useAuth();
  const [page, setPage] = useState("1");
  const [lastPage, setLastPage] = useState("");

  const token = handleGetToken();
  const [agendamentosAceitos, setAgendamentosAceitos] = useState<
    AgendamentoType[]
  >([]);

  useEffect(() => {
    (async () => {
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      const response = await api.get<AgendamentoType[]>(
        `/obter-solicitacoes-pendentes?page=${page}`
      );
      const ultimaPagina = await api.get("/obter-ultima-pagina");
      setLastPage(`${ultimaPagina.data}`);
      setAgendamentosAceitos([...response.data]);
    })();
  }, [page]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.divAgendamentos}>
          <h1>Listagem de agendamentos pendentes</h1>
          {agendamentosAceitos.map((agendamento, index) => (
            <Agendamentos agendamento={agendamento} key={index}></Agendamentos>
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
    </>
  );
}

export default MainGestor;
