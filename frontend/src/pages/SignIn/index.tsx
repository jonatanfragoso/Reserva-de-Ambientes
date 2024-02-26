import styles from "./styles.module.scss";
import Logo from "../../assets/logo.svg";
import api from "../../services/api";
import { FormEvent, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const { handleAddToken, handleAddGestor, handleGetGestor } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [idGestor, setIdGestor] = useState();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (!email || !senha) {
        throw new Error("Email e senha obrigatórios.");
      }
      const response = await api.post("/login", {
        email: email,
        senha: senha,
      });

      const { token } = response.data;
      const { id_gestor } = response.data.usuario;

      handleAddToken(token);
      handleAddGestor(id_gestor);
      setIdGestor(id_gestor);
      if (id_gestor == 2) navigate("/main-professor");
      if (id_gestor == 1) navigate("/main-gestor");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const id_gestor = handleGetGestor();
    if (id_gestor == "2") navigate("/main-professor");
    if (id_gestor == "1") navigate("/main-gestor");
  }, [idGestor]);

  return (
    <div className={styles.container}>
      <div className={styles.signIn}>
        <img src={Logo} alt="logo" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button className={styles.btnLogin}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
