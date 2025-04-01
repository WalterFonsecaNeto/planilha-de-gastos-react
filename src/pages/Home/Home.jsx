import { useState, useEffect } from "react";
import style from "./Home.module.css";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import { TbFileExport, TbFileImport } from "react-icons/tb";
import { FaRegFileExcel } from "react-icons/fa";

import CardValores from "../../components/CardValores/CardValores";
import FormularioAdicionarEntrada from "../../components/FormularioAdicionarEntrada/FormularioAdicionarEntrada";
import TabelaFinanceira from "../../components/TabelaFinanceira/TabelaFinanceira";

function Home() {
  const [entradas, setEntradas] = useState([]);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [gastosTotal, setGastosTotal] = useState(0);
  const [saldoRestante, setSaldoRestante] = useState(0);

  useEffect(() => {
    buscarDadosLocalStorage();
  }, []);

  useEffect(() => {
    calcularValores();
  }, [entradas]);

  function buscarDadosLocalStorage() {
    const dados = JSON.parse(localStorage.getItem("dados")) || [];
    setEntradas(dados);
  }

  function calcularValores() {
    const receitas = entradas.filter((entrada) => entrada.tipo === "Receita");
    const gastos = entradas.filter((entrada) => entrada.tipo === "Despesa");

    const totalReceita = receitas.reduce(
      (total, receita) => total + Number(receita.valor),
      0
    );
    const totalGastos = gastos.reduce(
      (total, gasto) => total + Number(gasto.valor),
      0
    );

    setReceitaTotal(totalReceita);
    setGastosTotal(totalGastos);
    setSaldoRestante(totalReceita - totalGastos);
  }

  return (
    <div className={style.container_principal}>
      <div className={style.container_titulo_acoes}>
        <h1 className={style.titulo}>Controle Financeiro</h1>
        <div className={style.botoes_acao}>
          <FormularioAdicionarEntrada />
          <button>
            <TbFileExport />
            Exportar Dados
          </button>
          <button>
            <TbFileImport />
            Importar Dados
          </button>
          <button>
            <FaRegFileExcel />
            Gerar Excel
          </button>
        </div>
      </div>

      <div className={style.container_cards}>
        <CardValores
          titulo={"Receita Total"}
          valor={receitaTotal}
          icone={<FiArrowUpRight />}
        />
        <CardValores
          titulo={"Gastos Totais"}
          valor={gastosTotal}
          icone={<FiArrowDownRight />}
        />
        <CardValores
          titulo={"Saldo Restante"}
          valor={saldoRestante}
          icone={<LuWallet />}
        />
      </div>

      <TabelaFinanceira entradas={entradas} />
    </div>
  );
}

export default Home;