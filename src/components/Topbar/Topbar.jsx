import style from "./Topbar.module.css";
import MenuHamburguer from "../MenuHamburguer/MenuHambueguer";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Topbar({ children, menuHamburguerAberto, setMenuHamburguerAberto }) {
  const navigate = useNavigate();

  const SairDoSistema = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div>
      <div className={style.topbar_conteudo}>
        <div className={style.container_menu_logo}>
          <div className={style.container_menu_hamburguer}>
            <MenuHamburguer
              menuHamburguerAberto={menuHamburguerAberto}
              setMenuHamburguerAberto={setMenuHamburguerAberto}
            />
          </div>
          <h2 className={style.titulo_logo}>DashHub</h2>
        </div>

        <div className={style.container_info}>
          <button className={style.botao_sair} onClick={SairDoSistema}>
            <FaSignOutAlt className={style.icone} />
            Sair
          </button>
        </div>
      </div>

      <div className={style.pagina_conteudo}>{children}</div>
    </div>
  );
}

export default Topbar;
