import style from "./CardValores.module.css";

function CardValores({ titulo, valor, icone }) {
  // Função para definir a cor do card com base no tipo de título
  const getCardColor = () => {
    switch (titulo) {
      case "Receita Total":
        return style.card_receita;
      case "Gastos Totais":
        return style.card_gastos;
      case "Saldo Restante":
        return style.card_saldo;
      default:
        return "";
    }
  };

  return (
    <div className={`${style.card_valores} ${getCardColor()}`}>
      <div className={style.titulo_icone}>
        <h3 className={style.titulo}>{titulo}</h3>
        <div className={style.icon}>{icone}</div>
      </div>
      <h3 className={style.valor}>R${valor.toFixed(2)}</h3>
    </div>
  );
}

export default CardValores;
