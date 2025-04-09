import style from "./Login.module.css"; 
import React, { useState } from "react";
import usuario from "../../services/usuario";
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
    }, 1500);
  }

  async function login() {
    if (!email || !senha) {
      exibirAlerta("Preencha todos os campos para continuar.", "danger");
      return;
    }
    
    try {
      setDesabilitarBotao(true);

      const user = await usuario.logarUsuarioAsync(email, senha);
      const dadosUsuario = await usuario.buscarUsuarioPorUidAsync(user.uid);

      if (dadosUsuario) {
        if (dadosUsuario.status === "ativo") {
          localStorage.setItem("userId", user.uid);
          exibirAlerta(`Seja bem-vindo(a), ${dadosUsuario.nome}!`, "success");

          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else if (dadosUsuario.status === "bloqueado") {
          exibirAlerta("Seu acesso ainda não foi liberado pelo administrador.", "warning");
        } else if (dadosUsuario.status === "inativo") {
          exibirAlerta("Usuário inativo. Entre em contato com o administrador.", "warning");
        } else {
          exibirAlerta("Status do usuário inválido.", "danger");
        }
      } else {
        exibirAlerta("Usuário não encontrado no banco de dados.", "danger");
      }
    } catch (error) {
      let errorMessage = "Erro ao fazer login: ";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage += "Email ou senha inválidos.";
          break;
        case "auth/user-disabled":
          errorMessage += "Usuário desativado.";
          break;
        case "auth/user-not-found":
          errorMessage += "Usuário não encontrado.";
          break;
        case "auth/invalid-credential":
          errorMessage += "Email ou senha inválidos.";
          break;
        default:
          errorMessage += error.message;
      }
    
      exibirAlerta(errorMessage, "danger");
    }
  }

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
