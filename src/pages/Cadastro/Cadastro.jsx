import style from "./Cadastro.module.css"
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
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      // Adiciona no Firestore na coleção "usuario"
      await addDoc(collection(db, "usuario"), {
        uid: user.uid,
        nome,
        email,
      });

      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Cadastro</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className={style.input}
      />
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
      <button onClick={handleRegister} className={style.button}>
        Cadastrar
      </button>
    </div>
  );
}

export default Cadastro;
