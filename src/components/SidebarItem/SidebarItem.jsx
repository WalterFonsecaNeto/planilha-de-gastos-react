import { Link, useLocation } from "react-router-dom";
import style from "./SidebarItem.module.css"

function SidebarItem({ texto, link, logo }) {
    const location = useLocation();
    const linkAtivo = location.pathname === link; 

    return (
        <Link 
            to={link} 
            className={`${style.sidebar_item} ${linkAtivo ? style.link_ativo : ""}`}
        >
            {logo}
            <h3 className={style.texto_link}>{texto}</h3>
        </Link>
    );
}

export default SidebarItem;
