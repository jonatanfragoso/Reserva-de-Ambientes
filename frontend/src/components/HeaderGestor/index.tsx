import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/ifac-logo.png";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faHome,
  faChalkboard,
  faPlus,
  faUserPen,
  faUsers,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
function HeaderGestor() {
  const { handleLogout } = useAuth();
  return (
    <header className={styles.header}>
      <img src={LogoImg} alt="Logo" />
      <nav>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faHome} />
          <NavLink
            to="/main-gestor"
            style={({ isActive }) => {
              return {
                color: isActive ? "green" : "inherit",
              };
            }}
          >
            Home
          {/* </NavLink>
        </div>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faPlus} />
          <NavLink
            to="/cadastrar-usuarios"
            style={({ isActive }) => {
              return {
                color: isActive ? "green" : "inherit",
              };
            }}
          >
            Cadastrar Usuários */}
          </NavLink>
        </div>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faUsers} />
          <NavLink
            to="/usuarios"
            style={({ isActive }) => {
              return {
                color: isActive ? "green" : "inherit",
              };
            }}
          >
            Usuários
          </NavLink>
        </div>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faPlus} />
          <NavLink
            to="/cadastrar-ambientes"
            style={({ isActive }) => {
              return {
                color: isActive ? "green" : "inherit",
              };
            }}
          >
            Cadastrar Ambientes
          </NavLink>
        </div>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faChalkboard} />
          <NavLink to="/main-professor">Página do Professor</NavLink>
        </div>
        <div className={styles.navLinks}>
          <FontAwesomeIcon icon={faGear} />
          <NavLink
            to="/meu-perfil-gestor"
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

export default HeaderGestor;
