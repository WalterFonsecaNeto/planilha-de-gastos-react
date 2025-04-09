import { useState, useEffect } from "react";
import style from "./ControleFinaceiro.module.css";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import CardValores from "../../components/CardValores/CardValores";
import FormularioAdicionarEntrada from "../../components/FormularioAdicionarEntrada/FormularioAdicionarEntrada";
import TabelaFinanceira from "../../components/TabelaFinanceira/TabelaFinanceira";

import {
  db,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "../../db/firebaseConfig";

function ControleFinaceiro() {
  
  const [menuHamburguerAberto, setMenuHamburguerAberto] = useState(true);
  const [entradas, setEntradas] = useState([]);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [gastosTotal, setGastosTotal] = useState(0);
  const [saldoRestante, setSaldoRestante] = useState(0);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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



  return (
    <Sidebar menuHamburguerAberto={menuHamburguerAberto}>
      <Topbar
        menuHamburguerAberto={menuHamburguerAberto}
        setMenuHamburguerAberto={setMenuHamburguerAberto}
      >
        <div className={style.pagina_conteudo}>
          <div className={style.container_titulo_acoes}>
            <h2 className={style.titulo}>Controle Financeiro</h2>
            <div className={style.botoes_acao}>
              <FormularioAdicionarEntrada userId={userId} />
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
      </Topbar>
    </Sidebar>
  );
}

export default ControleFinaceiro;