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

function CadastrarLocal() {
  const [descricao, setDescricao] = useState("");

  const navigate = useNavigate();
  const { handleGetToken } = useAuth();
  const token = handleGetToken();

  useEffect(() => {});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (!descricao) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      const response = await api.post("/cadastrar-local", {
        descricao: descricao,
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
        <h1>Cadastrar Ambiente</h1>
      </div>
      <div className={styles.divForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.noDivision}>
            <label htmlFor="">NOME DO AMBIENTE:</label>
            <input
              type="text"
              placeholder="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          <div className={styles.btnCadastro}>
            <button className={styles.btnVerde}>Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastrarLocal;
