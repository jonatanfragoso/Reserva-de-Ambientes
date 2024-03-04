import { useEffect, useState } from "react";
import { UsuarioType } from "../../types/UsuarioType";
import styles from "./styles.module.scss";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import EditarUsuarios from "../../components/EditarUsuarios";

function ListarUsuarios() {
  const { handleGetToken } = useAuth();
  const token = handleGetToken();
  const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);

  useEffect(() => {
    (async () => {
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      const response = await api.get<UsuarioType[]>("/usuarios");
      setUsuarios([...response.data]);
    })();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.divAgendamentos}>
        <h1>Usuários do Sistema</h1>

        {usuarios.map((usuario) => (
          <EditarUsuarios usuario={usuario} key={usuario.id}></EditarUsuarios>
        ))}
      </div>
    </div>
  );
}

export default ListarUsuarios;
