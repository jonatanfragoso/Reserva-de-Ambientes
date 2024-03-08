import styles from "./styles.module.scss";
import { Link, NavLink } from "react-router-dom";
import LogoImg from "../../assets/ifac-logo.png";
import useAuth from "../../hooks/useAuth";
function HeaderProfessor() {
  const { handleLogout, handleGetGestor } = useAuth();
  const id_gestor = handleGetGestor();
  return (
    <header className={styles.header}>
      <img src={LogoImg} alt="Logo" />
      <nav>
        <div className={styles.navLinks}>
          <NavLink
            to="/main-professor"
            style={({ isActive }) => {
              return {
                color: isActive ? "green" : "inherit",
              };
            }}
          >
            Home
          </NavLink>
        </div>
        <NavLink
          to="/historico-agendamentos"
          style={({ isActive }) => {
            return {
              color: isActive ? "green" : "inherit",
            };
          }}
        >
          Histórico de Agendamentos
        </NavLink>
        <NavLink
          to="/reservar-ambiente"
          style={({ isActive }) => {
            return {
              color: isActive ? "green" : "inherit",
            };
          }}
        >
          Reservar Ambiente
        </NavLink>
        {id_gestor === "1" && <NavLink to="main-gestor">Página Gestor</NavLink>}

        <NavLink
          to="/meu-perfil"
          style={({ isActive }) => {
            return {
              color: isActive ? "green" : "inherit",
            };
          }}
        >
          Configurações
        </NavLink>
        <Link to="/" onClick={handleLogout}>
          Sair
        </Link>
      </nav>
    </header>
  );
}

export default HeaderProfessor;
