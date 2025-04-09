import style from "./Cadastro.module.css";
import React, { useState } from "react";
import {
  auth,
  db,
  collection,
  addDoc,
  createUserWithEmailAndPassword,
} from "../../db/firebaseConfig";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      // Adiciona no Firestore na coleção "usuarios" (melhor usar plural para coleções)
      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        nome,
        email,
        createdAt: new Date(),
      });

      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
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
      alert(errorMessage);
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
            minLength="6"
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className={style.input}
            required
            minLength="6"
          />
          <button type="submit" className={style.button} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className={style.login_link}>
          Já tem uma conta? <a href="/login">Faça login</a>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
