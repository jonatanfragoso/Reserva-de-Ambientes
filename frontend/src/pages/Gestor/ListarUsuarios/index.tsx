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
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState("");

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
        const ultimaPagina = await api.get("/obter-ultima-pagina-usuarios");
        setLastPage(`${ultimaPagina.data}`);
        const response = await api.get<UsuarioType[]>(`/usuarios?page=${page}`);
        setUsuarios([...response.data]);
        console.log("else: ", response);
      }
    })();
  }, [filtro, page, lastPage]);
  if (filtro) {
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
              autoComplete="off"
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
            autoComplete="off"
          />
          <FontAwesomeIcon
            className={styles.lupa}
            icon={faMagnifyingGlass}
          ></FontAwesomeIcon>
        </div>

        {usuarios.map((usuario) => (
          <EditarUsuarios usuario={usuario} key={usuario.id}></EditarUsuarios>
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

export default ListarUsuarios;
