import { useState, useEffect } from "react";
import style from "./ModalEditarEntrada.module.css";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import { FiEdit } from "react-icons/fi";

function ModalEditarEntrada({ entrada, onSave, onClose }) {
  const [aberto, setAberto] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({
    valor: "",
    data: "",
    categoria: "",
    tipo: "",
    descricao: ""
  });

  useEffect(() => {
    if (entrada) {
      setDadosEdicao({
        valor: entrada.valor,
        data: entrada.data,
        categoria: entrada.categoria,
        tipo: entrada.tipo,
        descricao: entrada.descricao
      });
    }
  }, [entrada]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDadosEdicao(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...dadosEdicao,
      valor: Number(dadosEdicao.valor)
    });
    setAberto(false);
  };

  return (
    <div>
      <button 
        className={style.botao_editar}
        onClick={() => setAberto(true)}
      >
        <FiEdit />
      </button>
      
      {aberto && (
        <div className={style.container_total_modal}>
          <ModalGlobal
            aberto={aberto}
            setAberto={setAberto}
            titulo="Editar Entrada"
            onClose={onClose}
          >
            <div className={style.container_formulario}>
              <form className={style.formulario}>
                <div className={style.container_linha}>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="valor">Valor</label>
                    <input
                      type="number"
                      name="valor"
                      value={dadosEdicao.valor}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="data">Data</label>
                    <input
                      type="date"
                      name="data"
                      value={dadosEdicao.data}
                      onChange={handleChange}
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
                      onChange={handleChange}
                    />
                  </div>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="tipo">Tipo</label>
                    <select
                      name="tipo"
                      value={dadosEdicao.tipo}
                      onChange={handleChange}
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
                    onChange={handleChange}
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
                    onClick={handleSubmit}
                    className={style.botao_salvar}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </ModalGlobal>
        </div>
      )}
    </div>
  );
}

export default ModalEditarEntrada;