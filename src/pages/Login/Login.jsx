import style from "./Login.module.css";
import React, { useState } from "react";
import {
  auth,
  db,
  collection,
  getDocs,
  query,
  where,
  signInWithEmailAndPassword,
} from "../../db/firebaseConfig";
import { useNavigate } from "react-router-dom";
import AlertaGlobal from "../../components/AlertaGlobal/AlertaGlobal";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [desabilitarBotao, setDesabilitarBotao] = useState(false);

  function exibirAlerta(mensagem, tipo) {
    setMensagemAlerta(mensagem);
    setTipoAlerta(tipo);
    setMostrarAlerta(true);

    setTimeout(() => {
      setMostrarAlerta(false);
      setDesabilitarBotao(false);
    }, 1000);
  }

  async function login() {
    try {
      setDesabilitarBotao(true)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      // Verifica se o usuário existe na coleção "usuario"
      const q = query(collection(db, "usuarios"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        localStorage.setItem("userId", user.uid);

        exibirAlerta("Login realizado com sucesso!", "success");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        exibirAlerta("Usuário não encontrado no banco de dados.", "danger");
      }
    } catch (error) {
      exibirAlerta(`Erro ao fazer login: ${error.message}`, "danger");
    }
  };

  return (
    <div className={style.container_total}>
      <div className={style.container_login}>
        <h2 className={style.title}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={style.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={style.input}
        />
        <button
          onClick={login}
          className={style.button}
          disabled={desabilitarBotao}
        >
          {desabilitarBotao ? "Entrando..." : "Login"}
        </button>

        <p className={style.link}>
          Ainda não possui uma conta? <a href="/cadastro">Crie uma agora!</a>
        </p>
      </div>

      <AlertaGlobal
        tipo={tipoAlerta}
        mensagem={mensagemAlerta}
        visivel={mostrarAlerta}
        aoFechar={() => setMostrarAlerta(false)}
      />
    </div>
  );
}

export default Login;
