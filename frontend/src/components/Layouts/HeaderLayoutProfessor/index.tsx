import { Outlet } from "react-router-dom";
import styles from "./styles.module.scss";
import HeaderProfessor from "../../HeaderProfessor";
import NavBarSuperior from "../../NavBarSuperior";

function HeaderLayoutProfessor() {
  return (
    <div className={styles.container}>
      <HeaderProfessor></HeaderProfessor>
      <div className={styles.containerLeft}>
        <NavBarSuperior></NavBarSuperior>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default HeaderLayoutProfessor;
