import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/ifac-logo.png";
function HeaderProfessor() {
  return (
    <header className={styles.header}>
      <img src={LogoImg} alt="Logo" />
      <nav>
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
          Reseervar Ambiente
        </NavLink>
      </nav>
    </header>
  );
}

export default HeaderProfessor;
