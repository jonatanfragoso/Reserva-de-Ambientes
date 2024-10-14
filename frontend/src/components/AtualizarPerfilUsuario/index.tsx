import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import styles from "./styles.module.scss";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { Bounce, toast } from "react-toastify";

function AtualizarPerfilUsuario() {
  const { handleGetToken } = useAuth();
  const token = handleGetToken();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  Modal.setAppElement("#root");

  useEffect(() => {
    (async () => {
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      const perfil = await api.get("/obter-perfil");
      setNome(perfil.data.nome);
      setEmail(perfil.data.email);
      setTelefone(perfil.data.telefone);
      setModalIsOpen(false);
    })();
  }, []);

  async function handleAtualizarDadosdoPerfil() {
    try {
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
      }
      if (!email || !nome || !telefone) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      const response = await api.put("/atualizar-perfil", {
        nome: nome,
        email: email,
        telefone: telefone,
      });
      navigate("/");
      console.log(response.data.mensagem);

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

  function handleOpenModal() {
    setModalIsOpen(true);
  }
  function handleCloseModal() {
    setModalIsOpen(false);
    setSenhaAtual("");
    setNovaSenha("");
    setRepetirSenha("");
  }

  async function handleAtualizarSenha() {
    try {
      const response = await api.put("/atualizar-senha", {
        senhaAtual: senhaAtual,
        novaSenha: novaSenha,
      });

      handleCloseModal();
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
        <h1>Configurações de Perfil</h1>
      </div>
      <div className={styles.altPeril}>
        <div className={styles.divForm}>
          <form>
            <p>Nome: </p>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <p>Email: </p>
            <input
              type="text"
              placeholder="Nome"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p>Telefone: </p>
            <input
              type="text"
              placeholder="Nome"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
            <div className={styles.btnCadastro}>
              <button
                onClick={handleAtualizarDadosdoPerfil}
                className={styles.btnVerde}
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
        <div className={styles.divMudarSenha}>
          <button onClick={handleOpenModal}>Alterar Senha</button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Example Modal"
            overlayClassName={styles.modalOverlay}
            className={styles.modalContent}
          >
            <h1>Alterar Senha</h1>
            <form>
              <p>Senha atual: </p>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                required
              />
              <p>Nova senha:</p>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
              <p>Repetir nova senha:</p>
              <input
                type="password"
                value={repetirSenha}
                onChange={(e) => setRepetirSenha(e.target.value)}
                required
              />
              {novaSenha !== repetirSenha && (
                <div>
                  <p className={styles.danger}>As senhas não coincidem!</p>
                </div>
              )}
            </form>
            <div className={styles.botoesModel}>
              <button
                className={styles.btnVerde}
                onClick={handleAtualizarSenha}
              >
                Alterar Senha
              </button>
              <button className={styles.btnVermelho} onClick={handleCloseModal}>
                Cancelar
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AtualizarPerfilUsuario;
