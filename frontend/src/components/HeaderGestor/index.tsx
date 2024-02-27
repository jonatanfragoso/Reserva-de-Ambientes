import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/ifac-logo.png";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
function HeaderGestor() {
  const { handleLogout } = useAuth();
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
        <NavLink to="/main-professor">Página do Professor</NavLink>
        <Link to="/" onClick={handleLogout}>
          Sair
        </Link>
      </nav>
    </header>
  );
}

export default HeaderGestor;
