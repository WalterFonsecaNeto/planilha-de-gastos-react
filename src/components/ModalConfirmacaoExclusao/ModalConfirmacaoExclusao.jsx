import { useState } from "react";
import style from "./ModalConfirmacaoExclusao.module.css";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import { FiTrash2 } from "react-icons/fi";

function ModalConfirmacaoExclusao({ entrada, onConfirm, onClose }) {
  const [aberto, setAberto] = useState(false);

  const handleConfirmar = () => {
    onConfirm();
    setAberto(false);
  };

  return (
    <div>
      <button 
        className={style.botao_excluir}
        onClick={() => setAberto(true)}
      >
        <FiTrash2 />
      </button>
      
      {aberto && (
        <div className={style.container_total_modal}>
          <ModalGlobal
            aberto={aberto}
            setAberto={setAberto}
            titulo="Confirmar Exclusão"
            onClose={onClose}
          >
            <div className={style.container_conteudo}>
              <p>Tem certeza que deseja excluir esta entrada?</p>
              <div className={style.container_botoes}>
                <button
                  type="button"
                  className={style.botao_cancelar}
                  onClick={() => setAberto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmar}
                  className={style.botao_confirmar}
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </ModalGlobal>
        </div>
      )}
    </div>
  );
}

export default ModalConfirmacaoExclusao;