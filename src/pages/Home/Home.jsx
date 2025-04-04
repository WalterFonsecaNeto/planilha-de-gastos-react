// Home.js
import { useState, useEffect } from "react";
import style from "./Home.module.css";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import { TbFileExport, TbFileImport } from "react-icons/tb";
import { FaRegFileExcel } from "react-icons/fa";
import CardValores from "../../components/CardValores/CardValores";
import FormularioAdicionarEntrada from "../../components/FormularioAdicionarEntrada/FormularioAdicionarEntrada";
import TabelaFinanceira from "../../components/TabelaFinanceira/TabelaFinanceira";
import { useNavigate } from "react-router-dom";
import { db, collection, query, where, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from "../../db/firebaseConfig";

function Home() {
  const [entradas, setEntradas] = useState([]);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [gastosTotal, setGastosTotal] = useState(0);
  const [saldoRestante, setSaldoRestante] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    
    buscarDadosFirestore();
  }, [userId]);

  useEffect(() => {
    calcularValores();
  }, [entradas]);

  async function buscarDadosFirestore() {
    try {
      const q = query(
        collection(db, "entradas"),
        where("userId", "==", userId)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const dados = [];
        querySnapshot.forEach((doc) => {
          dados.push({ id: doc.id, ...doc.data() });
        });
        setEntradas(dados);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
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

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className={style.container_principal}>
      <div className={style.container_titulo_acoes}>
        <h1 className={style.titulo}>Controle Financeiro</h1>
        <div className={style.botoes_acao}>
          <FormularioAdicionarEntrada userId={userId} />
          <button onClick={handleLogout}>Sair</button>
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

      <TabelaFinanceira entradas={entradas} userId={userId} />
    </div>
  );
}

export default Home;