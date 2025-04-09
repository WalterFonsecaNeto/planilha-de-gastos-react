import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import AlertaGlobal from "../AlertaGlobal/AlertaGlobal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../db/firebaseConfig";
import style from "./FormularioEditarEntrada.module.css";

function FormularioEditarEntrada({ entradaSelecionada, carregarEntradas }) {
  const [aberto, setAberto] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({
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
  const [desabilitarBotao, setDesabilitarBotao] = useState(false);

  function exibirAlerta(mensagem, tipo) {
    setMensagemAlerta(mensagem);
    setTipoAlerta(tipo);
    setMostrarAlerta(true);

    setTimeout(() => {
      setMostrarAlerta(false);
      setDesabilitarBotao(false);
    }, 1000);
  }

  function pegarValores(e) {
    const { name, value } = e.target;
    setDadosEdicao((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function salvarEdicao() {
    const { nome, valor, data, categoria, tipo, descricao } = dadosEdicao;

    if (!nome || !valor || !data || !categoria || !tipo || !descricao) {
      exibirAlerta("Preencha todos os campos!", "danger");
      return;
    }

    setDesabilitarBotao(true);

    try {
      const docRef = doc(db, "entradas", entradaSelecionada.id);
      await updateDoc(docRef, {
        ...dadosEdicao,
        valor: Number(valor),
      });

      exibirAlerta("Entrada atualizada com sucesso!", "success");
      setAberto(false);
      carregarEntradas();
      
    } catch (error) {
      console.error("Erro ao atualizar entrada:", error);
      exibirAlerta("Erro ao atualizar a entrada.", "danger");
    }
  }

  useEffect(() => {
    if (aberto && entradaSelecionada) {
      setDadosEdicao({ ...entradaSelecionada });
    }
  }, [aberto, entradaSelecionada]);

  return (
    <div>
      <button className={style.botao_modal} onClick={() => setAberto(true)}>
        <FiEdit />
      </button>

      <AlertaGlobal
        tipo={tipoAlerta}
        mensagem={mensagemAlerta}
        visivel={mostrarAlerta}
        aoFechar={() => setMostrarAlerta(false)}
      />

      {aberto && (
        <div className={style.container_total_modal}>
          <ModalGlobal aberto={aberto} setAberto={setAberto} titulo="Editar Entrada">
            <div className={style.container_formulario}>
              <form className={style.formulario}>
                <div className={style.container_campos_formulario}>
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={dadosEdicao.nome}
                    onChange={pegarValores}
                  />
                </div>

                <div className={style.container_linha}>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="valor">Valor</label>
                    <input
                      type="number"
                      name="valor"
                      value={dadosEdicao.valor}
                      onChange={pegarValores}
                    />
                  </div>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="data">Data</label>
                    <input
                      type="date"
                      name="data"
                      value={dadosEdicao.data}
                      onChange={pegarValores}
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
                      onChange={pegarValores}
                    />
                  </div>

                  <div className={style.container_campos_formulario}>
                    <label htmlFor="tipo">Tipo</label>
                    <select
                      name="tipo"
                      value={dadosEdicao.tipo}
                      onChange={pegarValores}
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
                    name="descricao"
                    value={dadosEdicao.descricao}
                    onChange={pegarValores}
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
                    onClick={salvarEdicao}
                    className={style.botao_salvar}
                    disabled={desabilitarBotao}
                  >
                    Salvar
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

export default FormularioEditarEntrada;
