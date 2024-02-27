import { FormEvent, useState } from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
// import ptBR from "date-fns/locale/pt-BR";

function CadastrarUsuario() {
  const [idFuncao, setIdFuncao] = useState(0);
  const [idGestor, setIdGestor] = useState(0);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [telefone, setTelefone] = useState("");
  // const [showPassword, setShowPassword] = useState(Boolean);
  const navigate = useNavigate();
  const { handleGetToken } = useAuth();
  const token = handleGetToken();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (
        !email ||
        !senha ||
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
      await api.post("/cadastrar-usuario", {
        id_funcao: idFuncao,
        id_gestor: idGestor,
        email: email,
        senha: senha,
        nome: nome,
        telefone: telefone,
        matricula: matricula,
      });

      navigate("/main-gestor");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Cadastrar Usuario</h1>
      </div>
      <div className={styles.divForm}>
        <form onSubmit={handleSubmit}>
          <p>NOME COMPLETO: </p>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <p>EMAIL: </p>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p>SENHA: </p>

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <p>TELEFONE: </p>
          <input
            type="text"
            placeholder="Telefone: Ex: 99 99999-9988"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <p>MATRÍCULA: </p>
          <input
            type="text"
            placeholder="Matricula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />

          <div className={styles.selects}>
            <p>FUNÇÃO: </p>
            <select
              name="Funções"
              id="funcoes"
              required
              onChange={(e) => setIdFuncao(parseInt(e.target.value))}
            >
              <option value=""></option>
              <option value={2}>Professor</option>
              <option value={1}>Técnico</option>
            </select>
            <p>É GESTOR?: </p>
            <select
              name="Gestor"
              id="gestor"
              required
              onChange={(e) => setIdGestor(parseInt(e.target.value))}
            >
              <option value=""></option>
              <option value={1}>Sim</option>
              <option value={2}>Não</option>
            </select>
          </div>
          <div className={styles.btnCadastro}>
            <button className={styles.btnVerde}>Cadastrar</button>
            {/* <button className={styles.btnVermelho} onClick={Cancelar}>
                Cancelar
              </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastrarUsuario;
