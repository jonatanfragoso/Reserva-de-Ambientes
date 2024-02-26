import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import styles from "./styles.module.scss";
import { AgendamentoType } from "../../types/AgendamentoType";
import api from "../../services/api";
import Agendamentos from "../../components/Agendamentos";

function MainGestor() {
  const { handleGetToken } = useAuth();

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
        "/obter-solicitacoes-pendentes"
      );

      setAgendamentosAceitos([...response.data]);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.divAgendamentos}>
        <h1>Listagem de agendamentos pendentes</h1>
        {agendamentosAceitos.map((agendamento, index) => (
          <Agendamentos agendamento={agendamento} key={index}></Agendamentos>
        ))}
      </div>
    </div>
  );
}

export default MainGestor;
