import React, { useEffect } from "react";
import styles from "./ModalGlobal.module.css";

const ModalGlobal = ({ aberto, setAberto, titulo, children }) => {
  // Função interna para fechar o modal
  function fecharModal() {
    setAberto(false);
  }

  // Desabilitar a rolagem do body quando o modal for aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = "hidden"; // Desabilitar rolagem
    } else {
      document.body.style.overflow = "auto"; // Restaurar rolagem
    }

    // Limpeza quando o componente for desmontado ou o modal for fechado
    return () => {
      document.body.style.overflow = "auto"; // Garantir que a rolagem seja restaurada
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className={styles.container_total}>
      <div className={styles.container_modal}>
        {/* Cabeçalho do Modal */}
        <div className={styles.container_cabecalho}>
          <h2 className={styles.titulo}>{titulo}</h2>
          <button onClick={fecharModal} className={styles.botao_fechar_modal}>
            ✖
          </button>
        </div>

        <div className={styles.conteudo}>{children}</div>
      </div>
    </div>
  );
};

export default ModalGlobal;
