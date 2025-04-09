import style from "./Admin.module.css";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import TabelaUsuarios from "../../components/TabelaUsuarios/TabelaUsuarios";
import React from "react";
import usuario from "../../services/usuario"

function Admin() {
  const [menuHamburguerAberto, setMenuHamburguerAberto] = useState(true);
  const [usuarios, setUsuarios] = useState([]);

  async function carregarUsuarios() {
    try {
      const listaUsuario = await usuario.listarTodosUsuariosAsync();
      setUsuarios(listaUsuario);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <Sidebar menuHamburguerAberto={menuHamburguerAberto}>
      <Topbar
        menuHamburguerAberto={menuHamburguerAberto}
        setMenuHamburguerAberto={setMenuHamburguerAberto}
      >
        <div className={style.pagina_conteudo}>
          <h2 className={style.titulo}>Administração</h2>

          <TabelaUsuarios usuarios={usuarios} carregarUsuarios={carregarUsuarios} />
        </div>
      </Topbar>
    </Sidebar>
  );
}

export default Admin;
