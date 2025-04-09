import style from "./Cadastro.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuario from "../../services/usuario";
import AlertaGlobal from "../../components/AlertaGlobal/AlertaGlobal";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  function exibirAlerta(mensagem, tipo) {
    setMensagemAlerta(mensagem);
    setTipoAlerta(tipo);
    setMostrarAlerta(true);

    setTimeout(() => {
      setMostrarAlerta(false);
    }, 1500);
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      exibirAlerta("As senhas não coincidem!", "danger");
      return;
    }

    setLoading(true);

    try {
      await usuario.criarUsuarioAsync(email, senha, nome);
      exibirAlerta("Usuário cadastrado com sucesso!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      let errorMessage = "Erro ao cadastrar: ";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage += "Este email já está em uso";
          break;
        case "auth/invalid-email":
          errorMessage += "Email inválido";
          break;
        case "auth/weak-password":
          errorMessage += "Senha muito fraca";
          break;
        default:
          errorMessage += error.message;
      }
      exibirAlerta(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container_total}>
      <div className={style.container_cadastro}>
        <h2 className={style.title}>Cadastro</h2>
        <form onSubmit={handleRegister} className={style.form}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={style.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={style.input}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={style.input}
            required
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className={style.input}
            required
          />
          <button type="submit" className={style.button} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className={style.login_link}>
          Já tem uma conta? <a href="/login">Faça login</a>
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

export default Cadastro;
