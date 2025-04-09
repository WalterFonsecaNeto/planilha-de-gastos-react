import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import Home from "../pages/Home/Home";
import Cadastro from "../pages/Cadastro/Cadastro";
import Login from "../pages/Login/Login";
import ControleFinaceiro from "../pages/ControleFinaceiro/ControleFinaceiro";
import Investimentos from "../pages/Investimentos/Investimentos";
import Rotina from "../pages/Rotina/Rotina";
import Agenda from "../pages/Agenda/Agenda";
import Admin from "../pages/Admin/Admin";
import PaginaNaoAutorizada from "../pages/PaginaNaoAutorizada/PaginaNaoAutorizada";

const Rotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas administração */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/administracao" element={<Admin />} />
        </Route>

        {/* Página de não autorizado */}
        <Route path="/nao-autorizado" element={<PaginaNaoAutorizada />} />

        {/* Rota protegida */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/controle-finaceiro" element={<ControleFinaceiro />} />
          <Route path="/investimentos" element={<Investimentos />} />
          <Route path="/rotina" element={<Rotina />} />
          <Route path="/agenda" element={<Agenda />} />
        </Route>

        {/* Redireciona qualquer outra rota para o login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;
