import React from "react";
import style from "./AlertaGlobal.module.css";

function AlertaGlobal({ tipo, mensagem, visivel, aoFechar }) {
  if (!visivel) return null;

  // Definindo as cores para cada tipo de alerta com transparência
  let corFundo;
  let corTexto;
  let corBotao;

  switch (tipo) {
    case "success":
      corFundo = "rgba(72, 187, 120, 0.85)"; // verde mais suave
      corTexto = "#ffffff";
      corBotao = "#e6ffe6";
      break;
    case "danger":
      corFundo = "rgba(220, 53, 69, 0.85)"; // vermelho Bootstrap
      corTexto = "#ffffff";
      corBotao = "#ffe6e6";
      break;
    case "warning":
      corFundo = "rgba(255, 193, 7, 0.85)"; // amarelo Bootstrap
      corTexto = "#212529"; // texto escuro no amarelo
      corBotao = "#212529";
      break;
    case "info":
      corFundo = "rgba(23, 162, 184, 0.85)"; // azul claro Bootstrap
      corTexto = "#ffffff";
      corBotao = "#e6faff";
      break;
    default:
      corFundo = "rgba(248, 249, 250, 0.95)"; // cinza claro
      corTexto = "#212529"; // preto suave
      corBotao = "#212529";
      break;
  }
  

  return (
    <div
      className={style.alerta}
      style={{ backgroundColor: corFundo, color: corTexto }}
    >
      <span className={style.mensagem}>{mensagem}</span>
      <button
        className={style.fechar}
        onClick={aoFechar}
        style={{ color: corBotao }}
      >
        ✖
      </button>
    </div>
  );
}

export default AlertaGlobal;
