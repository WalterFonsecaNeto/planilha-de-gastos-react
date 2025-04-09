
import { HiMiniBars3 } from "react-icons/hi2";
import { AiOutlineBars } from "react-icons/ai";
import style from "./MenuHamburguer.module.css";

function MenuHamburguer({ menuHamburguerAberto, setMenuHamburguerAberto }) {
  

  const AlterarValorMenuHamburguer = () => {
    setMenuHamburguerAberto((prev) => !prev);
  };

  return (
    <div className={style.container}>
      <button className={style.hamburger} onClick={AlterarValorMenuHamburguer}>
        {menuHamburguerAberto ? <HiMiniBars3 /> : <AiOutlineBars />}
      </button>
    </div>
  );
}

export default MenuHamburguer;
