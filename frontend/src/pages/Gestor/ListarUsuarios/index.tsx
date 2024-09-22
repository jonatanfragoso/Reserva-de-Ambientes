import { useEffect, useState } from "react";
import { UsuarioType } from "../../../types/UsuarioType";
import styles from "./styles.module.scss";
import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api";
import EditarUsuarios from "../../../components/EditarUsuarios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function ListarUsuarios() {
  const { handleGetToken } = useAuth();
  const token = handleGetToken();
  const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);
  const [filtro, setFiltragem] = useState(String);

  useEffect(() => {
    (async () => {
      console.log(filtro);

      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      if (filtro) {
        const response = await api.get<UsuarioType[]>(
          `/usuarios?filtro=${filtro}`
        );
        setUsuarios([...response.data]);
        console.log("if: ", response);
      } else {
        const response = await api.get<UsuarioType[]>("/usuarios");
        setUsuarios([...response.data]);
        console.log("else: ", response);
      }
    })();
  }, [filtro]);
  return (
    <div className={styles.container}>
      <div className={styles.divAgendamentos}>
        <h1>Usuários do Sistema</h1>
        <div className={styles.filtro}>
          <input
            type="text"
            placeholder="Buscar Usuário..."
            name="filtro"
            value={filtro}
            onChange={(e) => setFiltragem(e.target.value)}
          />
          <FontAwesomeIcon
            className={styles.lupa}
            icon={faMagnifyingGlass}
          ></FontAwesomeIcon>
        </div>

        {usuarios.map((usuario) => (
          <EditarUsuarios usuario={usuario} key={usuario.id}></EditarUsuarios>
        ))}
      </div>
    </div>
  );
}

export default ListarUsuarios;
