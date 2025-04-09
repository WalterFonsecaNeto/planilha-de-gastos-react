import { useState, useEffect } from "react";
import style from "./FormularioAdicionarEntrada.module.css";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../db/firebaseConfig";
import AlertaGlobal from "../AlertaGlobal/AlertaGlobal";

function FormularioAdicionarEntrada({ userId, carregarEntradas }) {
  const [aberto, setAberto] = useState(false);
  const [entradaFormulario, setEntradaFormulario] = useState({
    nome: "",
    valor: null,
    data: "",
    categoria: "",
    tipo: "",
    descricao: "",
  });

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  function exibirAlerta(mensagem, tipo) {
    setMensagemAlerta(mensagem);
    setTipoAlerta(tipo);
    setMostrarAlerta(true);

    setTimeout(() => {
      setMostrarAlerta(false);
    }, 1500);
  }

  function SetValoreEntrada(event) {
    const { name, value } = event.target;
    setEntradaFormulario((prevEntrada) => ({
      ...prevEntrada,
      [name]: value,
    }));
  }

  async function SalvarEntrada() {
    const { nome, valor, data, categoria, tipo, descricao } = entradaFormulario;

    if (!nome || !valor || !data || !categoria || !tipo || !descricao) {
      exibirAlerta("Preencha todos os campos!", "danger");
      return;
    }

    try {
      await addDoc(collection(db, "entradas"), {
        ...entradaFormulario,
        valor: Number(valor),
        userId,
        createdAt: new Date(),
      });

      exibirAlerta("Entrada adicionada com sucesso!", "success");
      setAberto(false);
      carregarEntradas();
    } catch (error) {
      console.error("Erro ao salvar entrada:", error);
      exibirAlerta("Ocorreu um erro ao salvar a entrada", "danger");
    }
  }

  useEffect(() => {
    if (!aberto) {
      setEntradaFormulario({
        nome: "",
        valor: null,
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
        <MdOutlineAddCircleOutline />
        Adicionar Entrada
      </button>

      <AlertaGlobal
        tipo={tipoAlerta}
        mensagem={mensagemAlerta}
        visivel={mostrarAlerta}
        aoFechar={() => setMostrarAlerta(false)}
      />

      {aberto && (
        <div className={style.container_total_modal}>
          <ModalGlobal aberto={aberto} setAberto={setAberto} titulo="Adicionar Entrada">
            <div className={style.container_formulario}>
              <form className={style.formulario}>
                <div className={style.container_campos_formulario}>
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    placeholder="Nome da entrada"
                    name="nome"
                    value={entradaFormulario.nome}
                    onChange={SetValoreEntrada}
                  />
                </div>

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
                  <button
                    type="button"
                    onClick={SalvarEntrada}
                    className={style.botao_adicionar}
                  >
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
