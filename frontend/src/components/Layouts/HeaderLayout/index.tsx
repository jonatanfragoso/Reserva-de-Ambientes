import { Outlet } from "react-router-dom";
import styles from "./styles.module.scss";
import HeaderGestor from "../../HeaderGestor";

function HeaderLayout() {
  return (
    <div className={styles.container}>
      <HeaderGestor></HeaderGestor>
      <Outlet></Outlet>
    </div>
  );
}

export default HeaderLayout;
