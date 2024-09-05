import { FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ptBR from "date-fns/locale/pt-BR";
import { IMaskInput } from "react-imask";
// import validator from "validator";

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

  useEffect(() => {}, [email]);

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
      const response = await api.post("/cadastrar-usuario", {
        id_funcao: idFuncao,
        id_gestor: idGestor,
        email: email,
        senha: senha,
        nome: nome,
        telefone: telefone,
        matricula: matricula,
      });

      navigate("/main-gestor");
      return toast.success(response.data.mensagem, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      return toast.error(error.response.data.mensagem, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Cadastrar Usuário</h1>
      </div>
      <div className={styles.divForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.noDivision}>
            <label htmlFor="">NOME COMPLETO:</label>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className={styles.divisao}>
            <div className={styles.divisao2}>
              <label htmlFor="">EMAIL:</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* {!validator.isEmail(email) && <p>Insira um email válido!</p>} */}
            </div>

            <div className={styles.divisao2}>
              <label htmlFor="">SENHA:</label>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.divisao}>
            <div className={styles.divisao2}>
              <label htmlFor="">TELEFONE: </label>
              <IMaskInput
                type="text"
                placeholder="Telefone: Ex: 99 99999-9988"
                value={telefone}
                mask="(00) 0 0000-0000"
                onChange={(e) => setTelefone(e.target.value)}
                required
              ></IMaskInput>
            </div>
            <div className={styles.divisao2}>
              <label htmlFor="">MATRÍCULA: </label>
              <input
                type="text"
                placeholder="Matricula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.divisao}>
            <label htmlFor="">FUNÇÃO:</label>
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

            <label htmlFor="">É GESTOR?</label>
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastrarUsuario;
