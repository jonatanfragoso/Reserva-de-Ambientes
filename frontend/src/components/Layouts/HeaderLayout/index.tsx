import { Outlet } from "react-router-dom";
import styles from "./styles.module.scss";
import HeaderGestor from "../../HeaderGestor";
import NavBarSuperior from "../../NavBarSuperior";

function HeaderLayout() {
  return (
    <div className={styles.container}>
      <HeaderGestor></HeaderGestor>
      <div className={styles.containerLeft}>
        <NavBarSuperior></NavBarSuperior>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default HeaderLayout;
