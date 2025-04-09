import { useState } from "react";
import style from "./Home.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

function Home() {
  
  const [menuHamburguerAberto, setMenuHamburguerAberto] = useState(true);


  return (
    <Sidebar menuHamburguerAberto={menuHamburguerAberto}>
      <Topbar
        menuHamburguerAberto={menuHamburguerAberto}
        setMenuHamburguerAberto={setMenuHamburguerAberto}
      >
        <div className={style.pagina_conteudo}>
        <h2 className={style.titulo}>Home</h2>
        </div>
      </Topbar>
    </Sidebar>
  );
}

export default Home;
