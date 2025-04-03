import style from "./Login.module.css"
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

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      // Verifica se o usuário existe na coleção "usuario"
      const q = query(collection(db, "usuario"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Login realizado com sucesso!");
        navigate("/home");
      } else {
        alert("Usuário não encontrado no banco de dados.");
      }
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  return (
    <div className={style.container}>
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
      <button onClick={handleLogin} className={style.button}>
        Entrar
      </button>
    </div>
  );
}

export default Login;
