import style from "./Tarefas.module.css"
import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
function Tarefas() {
  const [menuHamburguerAberto, setMenuHamburguerAberto] = useState(true);

  return (
    <Sidebar menuHamburguerAberto={menuHamburguerAberto}>
      <Topbar
        menuHamburguerAberto={menuHamburguerAberto}
        setMenuHamburguerAberto={setMenuHamburguerAberto}
      >
        <div className={style.pagina_conteudo}>
          <h2 className={style.titulo}>Tarefas</h2>
        </div>
      </Topbar>
    </Sidebar>
  );
}

export default Tarefas;
