import { useState } from "react";
import { VscChevronDown, VscChevronUp, VscChevronRight } from "react-icons/vsc";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import style from "./TabelaFinanceira.module.css";
import { deleteDoc, doc, updateDoc } from "../../db/firebaseConfig";
import { db } from "../../db/firebaseConfig";
import ModalGlobal from "../ModalGlobal/ModalGlobal";

function TabelaFinanceira({ entradas, userId }) {
  // Estados para controle da tabela
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState({
    campo: "data",
    direcao: "desc",
  });
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [pesquisaCategoria, setPesquisaCategoria] = useState("");

  // Estados para os modais
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [entradaSelecionada, setEntradaSelecionada] = useState(null);
  const [dadosEdicao, setDadosEdicao] = useState({
    valor: "",
    data: "",
    categoria: "",
    tipo: "",
    descricao: "",
  });

  // Estado para controle da linha expandida
  const [linhaExpandida, setLinhaExpandida] = useState(null);

  const itensPorPagina = 10;

  // Funções de ordenação e paginação
  const ordenarPorCampo = (campo) => {
    setOrdenacao((prev) => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === "asc" ? "desc" : "asc",
    }));
    setPaginaAtual(1);
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    try {
      if (dataString.includes("-")) {
        const [year, month, day] = dataString.split("-");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
      } else if (dataString.includes("/")) {
        const [day, month, year] = dataString.split("/");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
      }
      return dataString;
    } catch {
      return dataString;
    }
  };

  // Filtragem e ordenação
  const entradasFiltradas = entradas.filter((entrada) => {
    if (filtroTipo !== "Todos" && entrada.tipo !== filtroTipo) return false;
    if (
      pesquisaCategoria &&
      !entrada.categoria
        ?.toLowerCase()
        .includes(pesquisaCategoria.toLowerCase())
    )
      return false;
    return true;
  });

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    if (dateStr.includes("-")) return new Date(dateStr);
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateStr);
  };

  const entradasOrdenadas = [...entradasFiltradas].sort((a, b) => {
    if (ordenacao.campo === "data") {
      return ordenacao.direcao === "desc"
        ? parseDate(b.data) - parseDate(a.data)
        : parseDate(a.data) - parseDate(b.data);
    }
    if (ordenacao.campo === "valor") {
      return ordenacao.direcao === "desc"
        ? parseFloat(b.valor) - parseFloat(a.valor)
        : parseFloat(a.valor) - parseFloat(b.valor);
    }
    if (ordenacao.campo === "nome") {
      return ordenacao.direcao === "desc"
        ? b.categoria?.localeCompare(a.categoria)
        : a.categoria?.localeCompare(b.categoria);
    }
    return 0;
  });

  // Paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensAtuais = entradasOrdenadas.slice(
    indicePrimeiroItem,
    indiceUltimoItem
  );
  const totalPaginas = Math.ceil(entradasOrdenadas.length / itensPorPagina);

  const mudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);
  const getIconeOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) return null;
    return ordenacao.direcao === "desc" ? <VscChevronDown /> : <VscChevronUp />;
  };

  // Função para expandir/recolher linha
  const toggleExpandirLinha = (id) => {
    setLinhaExpandida(linhaExpandida === id ? null : id);
  };

  // Funções para os modais
  const abrirModalExclusao = (entrada) => {
    setEntradaSelecionada(entrada);
    setModalExclusaoAberto(true);
  };

  const abrirModalEdicao = (entrada) => {
    setEntradaSelecionada(entrada);
    setDadosEdicao({
      valor: entrada.valor,
      data: entrada.data,
      categoria: entrada.categoria,
      tipo: entrada.tipo,
      descricao: entrada.descricao,
    });
    setModalEdicaoAberto(true);
  };

  const handleConfirmarExclusao = async () => {
    try {
      await deleteDoc(doc(db, "entradas", entradaSelecionada.id));
      setModalExclusaoAberto(false);
    } catch (error) {
      console.error("Erro ao deletar entrada:", error);
      alert("Não foi possível deletar a entrada");
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      await updateDoc(doc(db, "entradas", entradaSelecionada.id), {
        ...dadosEdicao,
        valor: Number(dadosEdicao.valor),
      });
      setModalEdicaoAberto(false);
    } catch (error) {
      console.error("Erro ao atualizar entrada:", error);
      alert("Não foi possível atualizar a entrada");
    }
  };

  const handleChangeEdicao = (e) => {
    const { name, value } = e.target;
    setDadosEdicao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Filtro de categoria */}
      <div className={style.filtro_categoria}>
        <input
          type="text"
          value={pesquisaCategoria}
          onChange={(e) => {
            setPesquisaCategoria(e.target.value);
            setPaginaAtual(1);
          }}
          placeholder="Pesquisar por categoria..."
        />
      </div>

      {/* Tabela principal */}
      <div className={style.container_tabela}>
        <div className={style.wrapper_tabela}>
          <table className={style.tabela}>
            <thead>
              <tr className={style.cabecalho_tabela}>
                <th
                  onClick={() => ordenarPorCampo("nome")}
                  className={style.cabecalho_ordenavel}
                >
                  Nome {getIconeOrdenacao("nome")}
                </th>
                <th className={style.cabecalho_filtro_tipo}>
                  <div className={style.dropdown_tipo}>
                    <span>Tipo</span>
                    <select
                      value={filtroTipo}
                      onChange={(e) => {
                        setFiltroTipo(e.target.value);
                        setPaginaAtual(1);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Todos">Todos</option>
                      <option value="Receita">Receita</option>
                      <option value="Despesa">Despesa</option>
                    </select>
                  </div>
                </th>
                <th
                  onClick={() => ordenarPorCampo("data")}
                  className={style.cabecalho_ordenavel}
                >
                  Data {getIconeOrdenacao("data")}
                </th>
                <th
                  onClick={() => ordenarPorCampo("valor")}
                  className={style.cabecalho_ordenavel}
                >
                  Valor {getIconeOrdenacao("valor")}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensAtuais.map((entrada) => (
                <>
                  <tr key={entrada.id}>
                    <td>{entrada.categoria}</td>
                    <td>{entrada.tipo}</td>
                    <td>{formatarData(entrada.data)}</td>
                    <td
                      className={
                        entrada.tipo === "Receita"
                          ? style.valor_positivo
                          : style.valor_negativo
                      }
                    >
                      R${" "}
                      {(parseFloat(entrada.valor) || 0)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                    <td>
                      <div className={style.container_acoes}>
                        <button
                          onClick={() => abrirModalEdicao(entrada)}
                          className={style.botao_editar}
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => abrirModalExclusao(entrada)}
                          className={style.botao_excluir}
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          onClick={() => toggleExpandirLinha(entrada.id)}
                          className={style.botao_expandir}
                        >
                          {linhaExpandida === entrada.id ? (
                            <VscChevronDown />
                          ) : (
                            <VscChevronRight />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Linha expandida com a descrição */}
                  {linhaExpandida === entrada.id && (
                    <tr className={style.linha_descricao}>
                      <td colSpan="5">
                        <div className={style.conteudo_descricao}>
                          <strong>Descrição:</strong> {entrada.descricao}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {entradasOrdenadas.length > 0 ? (
          <div className={style.paginacao}>
            <span>
              Mostrando {indicePrimeiroItem + 1} a{" "}
              {Math.min(indiceUltimoItem, entradasOrdenadas.length)} de{" "}
              {entradasOrdenadas.length} registros
            </span>
            <div>
              <button
                onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (numero) => (
                  <button
                    key={numero}
                    onClick={() => mudarPagina(numero)}
                    className={paginaAtual === numero ? style.pagina_ativa : ""}
                  >
                    {numero}
                  </button>
                )
              )}
              <button
                onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </button>
            </div>
          </div>
        ) : (
          <div className={style.sem_resultados}>
            Nenhum resultado encontrado com os filtros aplicados
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {modalExclusaoAberto && (
        <div className={style.container_total_modal}>
          <ModalGlobal
            aberto={modalExclusaoAberto}
            setAberto={setModalExclusaoAberto}
            titulo="Confirmar Exclusão"
          >
            <div className={style.container_conteudo}>
              <p>Tem certeza que deseja excluir esta entrada?</p>
              <div className={style.container_botoes}>
                <button
                  type="button"
                  className={style.botao_cancelar}
                  onClick={() => setModalExclusaoAberto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarExclusao}
                  className={style.botao_confirmar}
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </ModalGlobal>
        </div>
      )}

      {/* Modal de Edição */}
      {modalEdicaoAberto && (
        <div className={style.container_total_modal}>
          <ModalGlobal
            aberto={modalEdicaoAberto}
            setAberto={setModalEdicaoAberto}
            titulo="Editar Entrada"
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
                    onClick={() => setModalEdicaoAberto(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSalvarEdicao}
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
    </>
  );
}

export default TabelaFinanceira;
