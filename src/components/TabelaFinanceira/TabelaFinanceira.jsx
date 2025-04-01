import { useState } from "react";
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import style from "./TabelaFinanceira.module.css";

function TabelaFinanceira({ entradas }) {
  // Estados para controle de paginação, ordenação e filtros
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState({ campo: "data", direcao: "desc" });
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [pesquisaCategoria, setPesquisaCategoria] = useState("");
  const itensPorPagina = 10;

  // Função para alternar a ordenação de colunas
  const ordenarPorCampo = (campo) => {
    setOrdenacao((prev) => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === "asc" ? "desc" : "asc",
    }));
    setPaginaAtual(1);
  };

  // Função para formatar datas nos formatos suportados
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

  // Filtragem das entradas com base no tipo e na categoria
  const entradasFiltradas = entradas.filter((entrada) => {
    if (filtroTipo !== "Todos" && entrada.tipo !== filtroTipo) return false;
    if (pesquisaCategoria && !entrada.categoria.toLowerCase().includes(pesquisaCategoria.toLowerCase())) return false;
    return true;
  });

  // Função para converter datas para objetos Date
  const parseDate = (dateStr) => {
    if (dateStr.includes("-")) return new Date(dateStr);
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date();
  };

  // Ordenação das entradas filtradas com base no campo selecionado
  const entradasOrdenadas = [...entradasFiltradas].sort((a, b) => {
    if (ordenacao.campo === "data") {
      return ordenacao.direcao === "desc" ? parseDate(b.data) - parseDate(a.data) : parseDate(a.data) - parseDate(b.data);
    }
    if (ordenacao.campo === "valor") {
      return ordenacao.direcao === "desc" ? parseFloat(b.valor) - parseFloat(a.valor) : parseFloat(a.valor) - parseFloat(b.valor);
    }
    if (ordenacao.campo === "nome") {
      return ordenacao.direcao === "desc" ? b.categoria.localeCompare(a.categoria) : a.categoria.localeCompare(b.categoria);
    }
    return 0;
  });

  // Cálculo da paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensAtuais = entradasOrdenadas.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(entradasOrdenadas.length / itensPorPagina);

  // Função para mudar de página
  const mudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);

  // Função para exibir ícones de ordenação
  const getIconeOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) return null;
    return ordenacao.direcao === "desc" ? <VscChevronDown /> : <VscChevronUp />;
  };

  return (
    <>
      {/* Campo de pesquisa por categoria */}
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

      {/* Tabela de dados financeiros */}
      <div className={style.container_tabela}>
        <div className={style.wrapper_tabela}>
          <table className={style.tabela}>
            <thead>
              <tr>
                <th onClick={() => ordenarPorCampo("nome")} className={style.cabecalho_ordenavel}>
                  NOME {getIconeOrdenacao("nome")}
                </th>
                <th className={style.cabecalho_filtro_tipo}>
                  <div className={style.dropdown_tipo}>
                    <span>TIPO</span>
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
                  DATA {getIconeOrdenacao("data")}
                </th>
                <th onClick={() => ordenarPorCampo("valor")} className={style.cabecalho_ordenavel}>
                  VALOR {getIconeOrdenacao("valor")}
                </th>
              </tr>
            </thead>
            <tbody>
              {itensAtuais.map((entrada) => (
                <tr key={entrada.id}>
                  <td>{entrada.categoria}</td>
                  <td>{entrada.tipo}</td>
                  <td>{formatarData(entrada.data)}</td>
                  <td className={entrada.tipo === "Receita" ? style.valor_positivo : style.valor_negativo}>
                    R$ {(parseFloat(entrada.valor) || 0).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {entradasOrdenadas.length > 0 ? (
          <div className={style.paginacao}>
            <span>
              Mostrando {indicePrimeiroItem + 1} a {Math.min(indiceUltimoItem, entradasOrdenadas.length)} de {entradasOrdenadas.length} registros
            </span>
            <div>
              <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>Anterior</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                <button key={numero} onClick={() => mudarPagina(numero)} className={paginaAtual === numero ? style.pagina_ativa : ""}>{numero}</button>
              ))}
              <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>Próxima</button>
            </div>
          </div>
        ) : (
          <div className={style.sem_resultados}>Nenhum resultado encontrado com os filtros aplicados</div>
        )}
      </div>
    </>
  );
}

export default TabelaFinanceira;
