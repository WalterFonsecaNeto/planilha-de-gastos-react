import ModalGlobal from "../ModalGlobal/ModalGlobal";
import style from "./FormularioConfirmarExclusao.module.css";

function FormularioConfirmarExclusao({
  aberto,
  setAberto,
  entradaSelecionada,
  handleConfirmarExclusao,
}) {
  return (
    <ModalGlobal aberto={aberto} setAberto={setAberto} titulo="Confirmar Exclusão">
      <div className={style.container_conteudo}>
        <h4>Tem certeza que deseja excluir a entrada: </h4>
        <p className={style.entrada_selecionada}>{entradaSelecionada.categoria}</p>
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
            onClick={handleConfirmarExclusao}
            className={style.botao_confirmar}
          >
            Confirmar 
          </button>
        </div>
      </div>
    </ModalGlobal>
  );
}

export default FormularioConfirmarExclusao;