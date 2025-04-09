import { useState } from "react";
import { VscChevronDown, VscChevronUp, VscChevronRight } from "react-icons/vsc";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import style from "./TabelaFinanceira.module.css";
import { deleteDoc, doc, updateDoc } from "../../db/firebaseConfig";
import { db } from "../../db/firebaseConfig";
import FormularioEditarEntrada from "../FormularioEditarEntrada/FormularioEditarEntrada";
import FormularioConfirmarExclusao from "../FormularioConfirmarExclusao/FormularioConfirmarExclusao";

function TabelaFinanceira({ entradas, carregarEntradas }) {
  // Estados para controle da tabela
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState({
    campo: "data",
    direcao: "desc",
  });
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [pesquisa, setPesquisa] = useState("");



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
      pesquisa &&
      !entrada.nome?.toLowerCase().includes(pesquisa.toLowerCase()) &&
      !entrada.categoria?.toLowerCase().includes(pesquisa.toLowerCase())
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
        ? b.nome?.localeCompare(a.nome)
        : a.nome?.localeCompare(b.nome);
    }
    if (ordenacao.campo === "categoria") {
      return ordenacao.direcao === "desc"
        ? b.categoria?.localeCompare(a.categoria)
        : a.categoria?.localeCompare(b.categoria);
    }
    return 0;
  });

  // Paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensAtuais = entradasOrdenadas.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(entradasOrdenadas.length / itensPorPagina);

  const mudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);
  const getIconeOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) return null;
    return ordenacao.direcao === "desc" ? <VscChevronDown /> : <VscChevronUp />;
  };

  // Função para expandir/recolher linha
  const expandirLinha = (id) => {
    setLinhaExpandida(linhaExpandida === id ? null : id);
  };


  return (
    <>
      {/* Filtro de pesquisa */}
      <div className={style.filtro}>
        <input
          type="text"
          value={pesquisa}
          onChange={(e) => {
            setPesquisa(e.target.value);
            setPaginaAtual(1);
          }}
          placeholder="Pesquisar por nome ou categoria..."
        />
      </div>

      {/* Tabela principal */}
      <div className={style.container_tabela}>
        <div className={style.wrapper_tabela}>
          <table className={style.tabela}>
            <thead>
              <tr className={style.cabecalho_tabela}>
                <th onClick={() => ordenarPorCampo("nome")} className={style.cabecalho_ordenavel}>
                  Nome {getIconeOrdenacao("nome")}
                </th>
                <th onClick={() => ordenarPorCampo("categoria")} className={style.cabecalho_ordenavel}>
                  Categoria {getIconeOrdenacao("categoria")}
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
                <th onClick={() => ordenarPorCampo("data")} className={style.cabecalho_ordenavel}>
                  Data {getIconeOrdenacao("data")}
                </th>
                <th onClick={() => ordenarPorCampo("valor")} className={style.cabecalho_ordenavel}>
                  Valor {getIconeOrdenacao("valor")}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensAtuais.map((entrada) => (

                <>
                  <tr key={entrada.id}>
                    <td>{entrada.nome}</td>
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
                        <FormularioEditarEntrada entradaSelecionada={entrada} carregarEntradas={carregarEntradas}/>

                        <FormularioConfirmarExclusao entradaSelecionada={entrada} carregarEntradas={carregarEntradas}/>
                        <button
                          onClick={() => expandirLinha(entrada.id)}
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
                      <td colSpan="6">
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
    </>
  );
}

export default TabelaFinanceira;