import styles from "./styles.module.scss";
import CadastrarUsuario from "../../../components/CadastrarUsuario";

function CadastrarUsuarios() {
  return (
    <div className={styles.container}>
      <CadastrarUsuario></CadastrarUsuario>
    </div>
  );
}
export default CadastrarUsuarios;
