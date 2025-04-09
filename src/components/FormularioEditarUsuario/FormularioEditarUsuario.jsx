import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import AlertaGlobal from "../AlertaGlobal/AlertaGlobal";
import usuarioService from "../../services/usuario";
import style from "./FormularioEditarUsuario.module.css";

function FormularioEditarUsuario({ usuarioSelecionado, carregarUsuarios }) {
  const [aberto, setAberto] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({
    nome: "",
    email: "",
    tipo: "",
    status: "",
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
    const { nome, email, tipo, status } = dadosEdicao;

    if (!nome || !email || !tipo || !status) {
      exibirAlerta("Preencha todos os campos!", "danger");
      return;
    }

    setDesabilitarBotao(true);

    try {
      await usuarioService.editarUsuarioAsync(usuarioSelecionado.id, dadosEdicao);
      exibirAlerta("Usuário atualizado com sucesso!", "success");
      setAberto(false);
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      exibirAlerta("Erro ao atualizar o usuário.", "danger");
    }
  }

  useEffect(() => {
    if (aberto && usuarioSelecionado) {
      setDadosEdicao({ ...usuarioSelecionado });
    }
  }, [aberto, usuarioSelecionado]);

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
          <ModalGlobal aberto={aberto} setAberto={setAberto} titulo="Editar Usuário">
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

                <div className={style.container_campos_formulario}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={dadosEdicao.email}
                    onChange={pegarValores}
                    disabled
                  />
                </div>

                <div className={style.container_linha}>
                  <div className={style.container_campos_formulario}>
                    <label htmlFor="status">Status</label>
                    <select name="status" value={dadosEdicao.status} onChange={pegarValores}>
                      <option value="">Selecione um status</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="bloqueado">Bloqueado</option>
                    </select>
                  </div>

                  <div className={style.container_campos_formulario}>
                    <label htmlFor="tipo">Tipo</label>
                    <select name="tipo" value={dadosEdicao.tipo} onChange={pegarValores}>
                      <option value="">Selecione um tipo</option>
                      <option value="admin">Admin</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </div>
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

export default FormularioEditarUsuario;
