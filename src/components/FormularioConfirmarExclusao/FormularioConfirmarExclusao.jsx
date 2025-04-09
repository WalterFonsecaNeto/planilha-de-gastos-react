import { FiTrash2 } from "react-icons/fi";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import style from "./FormularioConfirmarExclusao.module.css";
import { useState } from "react";
import entrada from "../../services/entrada"; // ajuste o caminho conforme sua estrutura
import AlertaGlobal from "../../components/AlertaGlobal/AlertaGlobal";

function FormularioConfirmarExclusao({
  entradaSelecionada,
  carregarEntradas
}) {
  const [aberto, setAberto] = useState(false);
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
      carregarEntradas();
    }, 1000);
  }

  async function excluirEntrada() {
    setDesabilitarBotao(true);
    try {
      await entrada.deletarEntradaAsync(entradaSelecionada.id);
      exibirAlerta("Entrada excluída com sucesso!", "success");
      setAberto(false);
      
    } catch (error) {
      console.error("Erro ao excluir entrada:", error);
      exibirAlerta("Erro ao excluir a entrada.", "danger");
    }
  }

  return (
    <div>
      <button className={style.botao_modal} onClick={() => setAberto(true)}>
        <FiTrash2 />
      </button>

      <AlertaGlobal
        tipo={tipoAlerta}
        mensagem={mensagemAlerta}
        visivel={mostrarAlerta}
        aoFechar={() => setMostrarAlerta(false)}
      />

      {aberto && (
        <ModalGlobal aberto={aberto} setAberto={setAberto} titulo="Confirmar Exclusão">
          <div className={style.container_conteudo}>
            <h4>Tem certeza que deseja excluir a entrada:</h4>
            <p className={style.entrada_selecionada}>{entradaSelecionada.categoria}</p>
            <div className={style.container_botoes}>
              <button
                type="button"
                className={style.botao_cancelar}
                onClick={() => setAberto(false)}
                disabled={desabilitarBotao}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={excluirEntrada}
                className={style.botao_confirmar}
                disabled={desabilitarBotao}
              >
                Confirmar
              </button>
            </div>
          </div>
        </ModalGlobal>
      )}
    </div>
  );
}

export default FormularioConfirmarExclusao;
