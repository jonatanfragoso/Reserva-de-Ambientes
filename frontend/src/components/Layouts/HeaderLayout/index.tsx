import { Outlet } from "react-router-dom";
import styles from "./styles.module.scss";
import HeaderGestor from "../../HeaderGestor";

import NavBarSuperiorGestor from "../../NavBarSuperiorGestor";

function HeaderLayout() {
  return (
    <div className={styles.container}>
      <HeaderGestor></HeaderGestor>
      <div className={styles.containerLeft}>
        <NavBarSuperiorGestor></NavBarSuperiorGestor>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default HeaderLayout;
