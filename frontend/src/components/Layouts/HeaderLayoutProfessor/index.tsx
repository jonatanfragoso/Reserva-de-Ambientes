import { Outlet } from "react-router-dom";
import styles from "./styles.module.scss";
import HeaderProfessor from "../../HeaderProfessor";

function HeaderLayoutProfessor() {
  return (
    <div className={styles.container}>
      <HeaderProfessor></HeaderProfessor>
      <Outlet></Outlet>
    </div>
  );
}

export default HeaderLayoutProfessor;
