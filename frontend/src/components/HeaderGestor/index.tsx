import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/ifac-logo.png";
function HeaderGestor() {
  return (
    <header className={styles.header}>
      <img src={LogoImg} alt="Logo" />
      <nav>
        <NavLink
          to="/main-gestor"
          style={({ isActive }) => {
            return {
              color: isActive ? "green" : "inherit",
            };
          }}
        >
          Home
        </NavLink>
        <NavLink
          to="/cadastrar-usuarios"
          style={({ isActive }) => {
            return {
              color: isActive ? "green" : "inherit",
            };
          }}
        >
          Cadastrar Usuarios
        </NavLink>
      </nav>
    </header>
  );
}

export default HeaderGestor;
