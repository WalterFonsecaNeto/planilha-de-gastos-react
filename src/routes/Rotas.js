import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home/Home";
import Cadastro from "../pages/Cadastro/Cadastro";
import Login from "../pages/Login/Login";
import ControleFinaceiro from "../pages/ControleFinaceiro/ControleFinaceiro";
import Investimentos from "../pages/Investimentos/Investimentos";
import Tarefas from "../pages/Tarefas/Tarefas";

const Rotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rota protegida */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/controle-finaceiro" element={<ControleFinaceiro />} />
          <Route path="/investimentos" element={<Investimentos />} />
          <Route path="/tarefas" element={<Tarefas />} />
        </Route>

        {/* Redireciona qualquer outra rota para o login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;
