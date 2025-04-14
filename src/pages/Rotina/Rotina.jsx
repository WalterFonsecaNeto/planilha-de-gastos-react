import { useState, useEffect } from "react";
import style from "./Rotina.module.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import FormularioAdicionarRotina from "../../components/FormularioAdicionarRotina/FormularioAdicionarRotina";
import rotinaService from "../../services/rotina";
import CalendarioRotinas from "../../components/ListaRotinas/CalendarioRotinas";

function Rotina() {
  const [menuHamburguerAberto, setMenuHamburguerAberto] = useState(true);
  const [rotinas, setRotinas] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    carregarRotinas();
  }, [userId]);

  async function carregarRotinas() {
    try {
      const dados = await rotinaService.listarRotinasPorUsuario(userId);
      setRotinas(dados);
    } catch (error) {
      console.error("Erro ao carregar rotinas:", error);
    }
  }

  return (
    <Sidebar menuHamburguerAberto={menuHamburguerAberto}>
      <Topbar
        menuHamburguerAberto={menuHamburguerAberto}
        setMenuHamburguerAberto={setMenuHamburguerAberto}
      >
        <div className={style.pagina_conteudo}>
          <div className={style.container_titulo_acoes}>
            <h2 className={style.titulo}>Controle de Rotinas</h2>
            <div className={style.botoes_acao}>
              <FormularioAdicionarRotina userId={userId} carregarRotinas={carregarRotinas} />
            </div>
          </div>


          <CalendarioRotinas rotinas={rotinas} carregarRotinas={carregarRotinas}  />
        </div>
      </Topbar>
    </Sidebar>
  );
}

export default Rotina;
