import React from "react";
import styles from "./AlertaGlobal.module.css";

function AlertaGlobal({ tipo, mensagem, visivel, aoFechar }) {
  if (!visivel) return null;

  // Definindo as cores para cada tipo de alerta com transparência
  let corFundo;
  let corTexto;
  let corBotao;

  switch (tipo) {
    case "success":
      corFundo = "rgba(40, 167, 69, 0.8)";
      corTexto = "#ffffff";
      corBotao = "#ffffff";
      break;
    case "danger":
      corFundo = "rgba(255, 0, 25, 0.68)";
      corTexto = "#ffffff";
      corBotao = "#ffffff";
      break;
    case "warning":
      corFundo = "rgba(255, 208, 69, 0.54)";
      corTexto = "#ffffff";
      corBotao = "#ffffff";
      break;
    case "info":
      corFundo = "rgba(23, 163, 184, 0.64)";
      corTexto = "#ffffff";
      corBotao = "#ffffff";
      break;
    default:
      corFundo = "rgba(248, 249, 250, 0.8)";
      corTexto = "#000000";
      corBotao = "#000000";
      break;
  }

  return (
    <div
      className={styles.alerta}
      style={{ backgroundColor: corFundo, color: corTexto }}
    >
      <span>{mensagem}</span>
      <button
        className={styles.fechar}
        onClick={aoFechar}
        style={{ color: corBotao }}
      >
        ✖
      </button>
    </div>
  );
}

export default AlertaGlobal;
