import style from "./Sidebar.module.css";
import { FaHome, FaChartBar, FaCoins, FaCalendarAlt,FaClock   } from "react-icons/fa";
import SidebarItem from "../SidebarItem/SidebarItem";

function Sidebar({ children, menuHamburguerAberto }) {
  return (
    <div
      className={`${style.container_total} ${
        !menuHamburguerAberto ? style.closed : ""
      }`}
    >
      <div
        className={`${style.sidebar_conteudo} ${
          !menuHamburguerAberto ? style.sidebar_hidden : ""
        }`}
      >
        <div className={style.sidebar_corpo}>
          <SidebarItem texto="Home" link="/home" logo={<FaHome />} />
          <SidebarItem texto="Controle Financeiro" link="/controle-finaceiro" logo={<FaChartBar />} />
          <SidebarItem texto="Investimentos" link="/investimentos" logo={<FaCoins   />} />
          <SidebarItem texto="Rotina" link="/rotina" logo={<FaClock  />} />
          <SidebarItem texto="Agenda" link="/agenda" logo={<FaCalendarAlt />} />
        </div>
      </div>

      <div className={style.pagina_conteudo}>{children}</div>
    </div>
  );
}

export default Sidebar;
