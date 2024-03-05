import { UsuarioType } from "../../types/UsuarioType";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

interface IProps {
  usuario: UsuarioType;
}

function EditarUsuarios({ usuario }: IProps) {
  const navigate = useNavigate();

  function handleNavigate() {
    navigate(`/usuarios/${usuario.id}`);
  }
  return (
    <div className={styles.container}>
      <p>Nome: {usuario.nome}</p>
      <p>Email: {usuario.email}</p>
      <p>Telefone: {usuario.telefone}</p>
      <p>Matrícula: {usuario.matricula}</p>
      {usuario.id_funcao === 1 && <p>Função: Professor</p>}
      {usuario.id_funcao === 2 && <p>Função: Técnico</p>}
      {usuario.id_gestor === 1 && <p>Gestor: Sim</p>}
      {usuario.id_gestor === 2 && <p>Gestor: Não</p>}
      <button onClick={handleNavigate}>Editar</button>
    </div>
  );
}

export default EditarUsuarios;
