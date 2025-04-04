import ModalGlobal from "../ModalGlobal/ModalGlobal";
import style from "./FormularioEditarEntrada.module.css";

function FormularioEditarEntrada({
  aberto,
  setAberto,
  dadosEdicao,
  handleChangeEdicao,
  handleSalvarEdicao,
}) {
  return (
    <ModalGlobal aberto={aberto} setAberto={setAberto} titulo="Editar Entrada">
      <div className={style.container_formulario}>
        <form className={style.formulario}>
          <div className={style.container_linha}>
            <div className={style.container_campos_formulario}>
              <label htmlFor="valor">Valor</label>
              <input
                type="number"
                name="valor"
                value={dadosEdicao.valor}
                onChange={handleChangeEdicao}
              />
            </div>
            <div className={style.container_campos_formulario}>
              <label htmlFor="data">Data</label>
              <input
                type="date"
                name="data"
                value={dadosEdicao.data}
                onChange={handleChangeEdicao}
              />
            </div>
          </div>

          <div className={style.container_linha}>
            <div className={style.container_campos_formulario}>
              <label htmlFor="categoria">Categoria</label>
              <input
                type="text"
                name="categoria"
                value={dadosEdicao.categoria}
                onChange={handleChangeEdicao}
              />
            </div>
            <div className={style.container_campos_formulario}>
              <label htmlFor="tipo">Tipo</label>
              <select
                name="tipo"
                value={dadosEdicao.tipo}
                onChange={handleChangeEdicao}
              >
                <option value="Despesa">Despesa</option>
                <option value="Receita">Receita</option>
              </select>
            </div>
          </div>

          <div className={style.container_campos_formulario}>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              name="descricao"
              value={dadosEdicao.descricao}
              onChange={handleChangeEdicao}
            />
          </div>

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
              onClick={handleSalvarEdicao}
              className={style.botao_salvar}
            >
              Salvar 
            </button>
          </div>
        </form>
      </div>
    </ModalGlobal>
  );
}

export default FormularioEditarEntrada;