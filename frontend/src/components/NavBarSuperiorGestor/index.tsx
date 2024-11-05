import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

function NavBarSuperiorGestor() {
  const { handleGetToken } = useAuth();
  const token = handleGetToken();
  const [nome, setNome] = useState("");
  useEffect(() => {
    (async () => {
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      const usuario = await api.get("/obter-perfil");
      setNome(usuario.data.nome.split(" ")[0]);
    })();
  }, []);
  return (
    <header className={styles.navbarSuperior}>
      <p>Olá, {nome}!</p>
      <NavLink to="/meu-perfil-gestor">
        <FontAwesomeIcon className={styles.engrenagem} icon={faGear} />
      </NavLink>
    </header>
  );
}

export default NavBarSuperiorGestor;
