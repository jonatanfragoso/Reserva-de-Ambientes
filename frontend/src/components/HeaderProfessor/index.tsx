import styles from "./styles.module.scss";
import { Link, NavLink } from "react-router-dom";
import LogoImg from "../../assets/ifac-logo.png";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faHome,
  faChalkboard,
  faCalendarDays,
  faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
function HeaderProfessor() {
  const { handleLogout, handleGetGestor } = useAuth();
  const id_gestor = handleGetGestor();
  return (
    <header className={styles.header}>
      <img src={LogoImg} alt="Logo" />
      <nav>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faHome} />
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
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faCalendarDays} />
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
        </div>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faHistory} />
          <NavLink
            to="/historico-agendamentos"
            style={({ isActive }) => {
              return {
                color: isActive ? "green" : "inherit",
              };
            }}
          >
            Histórico
          </NavLink>
        </div>
        {id_gestor === "1" && (
          <div className={styles.navLinks}>
            <FontAwesomeIcon icon={faChalkboard} />
            {id_gestor === "1" && (
              <NavLink to="main-gestor">Página Gestor</NavLink>
            )}
          </div>
        )}

        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faGear} />
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
        </div>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <Link to="/" onClick={handleLogout}>
            Sair
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default HeaderProfessor;
