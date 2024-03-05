import { FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
function EditarUsuarioUnico() {
  const [idFuncao, setIdFuncao] = useState(Number);
  const [idGestor, setIdGestor] = useState(Number);
  const [nome, setNome] = useState(String);
  // const [senha, setSenha] = useState(String);
  const [email, setEmail] = useState(String);
  const [matricula, setMatricula] = useState(String);
  const [telefone, setTelefone] = useState(String);
  const { handleGetToken } = useAuth();
  const token = handleGetToken();
  const navigate = useNavigate();
  const { id } = useParams();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (
        !email ||
        !idFuncao ||
        !idGestor ||
        !nome ||
        !telefone ||
        !matricula
      ) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      await api.put("/editar-usuario", {
        id_funcao: idFuncao,
        id_gestor: idGestor,
        email: email,
        nome: nome,
        telefone: telefone,
        matricula: matricula,
      });

      navigate("/main-gestor");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
    }
    (async () => {
      const response = await api.get(`/usuarios/${id}`);
      const { usuario } = response.data;
      setNome(usuario.nome);
      setEmail(usuario.email);
      setTelefone(usuario.telefone);
      setMatricula(usuario.matricula);
      setIdFuncao(usuario.id_funcao);
      setIdGestor(usuario.id_gestor);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Editar Usuario</h1>
      </div>
      <div className={styles.divForm}>
        <form onSubmit={handleSubmit}>
          <p>NOME COMPLETO: </p>
          <input
            type="text"
            placeholder="Nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <p>EMAIL: </p>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p>TELEFONE: </p>
          <input
            type="text"
            name="telefone"
            placeholder="Telefone: Ex: 99 99999-9988"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <p>MATRÍCULA: </p>
          <input
            type="text"
            name="matricula"
            placeholder="Matricula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />

          <div className={styles.selects}>
            <p>FUNÇÃO: </p>
            <select
              name="funcoes"
              id="funcoes"
              required
              value={idFuncao}
              onChange={(e) => setIdFuncao(parseInt(e.target.value))}
            >
              <option value=""></option>
              <option value={2}>Professor</option>
              <option value={1}>Técnico</option>
            </select>
            <p>É GESTOR?: </p>
            <select
              name="gestor"
              id="gestor"
              required
              value={idGestor}
              onChange={(e) => setIdGestor(parseInt(e.target.value))}
            >
              <option value=""></option>
              <option value={1}>Sim</option>
              <option value={2}>Não</option>
            </select>
          </div>
          <div className={styles.btnCadastro}>
            <button className={styles.btnVerde}>Salvar Alterações</button>
            {/* <button className={styles.btnVermelho} onClick={Cancelar}>
                Cancelar
              </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarUsuarioUnico;
