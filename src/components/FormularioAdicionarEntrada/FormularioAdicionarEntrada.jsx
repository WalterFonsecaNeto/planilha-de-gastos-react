import { useState, useEffect } from "react";
import style from "./FormularioAdicionarEntrada.module.css";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import { MdOutlineAddCircleOutline } from "react-icons/md";

function FormularioAdicionarEntrada() {
  const [aberto, setAberto] = useState(false);
  const [entradaFormulario, setEntradaFormulario] = useState({
    valor: null,
    data: "",
    categoria: "",
    tipo: "",
    descricao: "",
  });

  function SetValoreEntrada(event) {
    const { name, value } = event.target;
    setEntradaFormulario((prevEntrada) => ({
      ...prevEntrada,
      [name]: value,
    }));
  }

  function SalvarEntrada() {
    if (!entradaFormulario.valor ||!entradaFormulario.data ||!entradaFormulario.descricao) {
      alert("Preencha todos os campos!");
      return;
    }
    console.log(entradaFormulario)
    const dados = JSON.parse(localStorage.getItem("dados")) || [];
    dados.push(entradaFormulario);
    localStorage.setItem("dados", JSON.stringify(dados));

  }

  // Limpa os campos quando o modal é fechado
  useEffect(() => {
    if (!aberto) {
      setEntradaFormulario({
        valor: 0,
        data: "",
        categoria: "",
        tipo: "",
        descricao: "",
      });
    }
  }, [aberto]);

  return (
    <div>
      <button className={style.botao_modal} onClick={() => setAberto(true)}>
              <MdOutlineAddCircleOutline />Adicionar Entrada 
      </button>
      {aberto && (
        <div className={style.container_total_modal}>
          <ModalGlobal
            aberto={aberto}
            setAberto={setAberto}
            titulo="Adicionar Entrada"
          >
            <div className={style.container_formulario}>
              <form className={style.formulario}>
                <div className={style.container_linha}>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="valor">Valor</label>
                    <input
                      type="number"
                      placeholder="Valor"
                      name="valor"
                      value={entradaFormulario.valor}
                      onChange={SetValoreEntrada}
                    />
                  </div>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="data">Data</label>
                    <input
                      type="date"
                      placeholder="Data"
                      name="data"
                      value={entradaFormulario.data}
                      onChange={SetValoreEntrada}
                    />
                  </div>
                </div>

                <div className={style.container_linha}>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="categoria">Categoria</label>
                    <input
                      type="text"
                      placeholder="Categoria"
                      name="categoria"
                      value={entradaFormulario.categoria}
                      onChange={SetValoreEntrada}
                    />
                  </div>

                  <div className={style.container_campos_formulario}>
                    <label htmlFor="tipo">Tipo</label>
                    <select
                      name="tipo"
                      value={entradaFormulario.tipo}
                      onChange={SetValoreEntrada}
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="Despesa">Despesa</option>
                      <option value="Receita">Receita</option>
                    </select>
                  </div>
                </div>

                <div className={style.container_campos_formulario}>
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    placeholder="Descrição"
                    name="descricao"
                    value={entradaFormulario.descricao}
                    onChange={SetValoreEntrada}
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
                  <button onClick={SalvarEntrada} className={style.botao_adicionar}>
                    Adicionar
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

export default FormularioAdicionarEntrada;
