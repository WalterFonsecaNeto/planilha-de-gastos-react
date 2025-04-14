import { useState, useEffect } from "react";
import style from "./FormularioAdicionarRotina.module.css";
import ModalGlobal from "../ModalGlobal/ModalGlobal";
import AlertaGlobal from "../AlertaGlobal/AlertaGlobal";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import rotinaService from "../../services/rotina"

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function FormularioAdicionarRotina({ userId, carregarRotinas }) {
  const [aberto, setAberto] = useState(false);
  const [rotinaFormulario, setRotinaFormulario] = useState({
    nome: "",
    descricao: "",
    tipo: "fixa",
    diaSemana: [],
    dataEspecifica: "",
    horaInicio: "",
    horaFim: "",
  });

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [inicioSelecao, setInicioSelecao] = useState(null);

  function exibirAlerta(mensagem, tipo) {
    setMensagemAlerta(mensagem);
    setTipoAlerta(tipo);
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  }

  function setValorRotina(event) {
    const { name, value } = event.target;
    setRotinaFormulario(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'tipo' && value === 'especifico' && { diaSemana: [] }),
      ...(name === 'tipo' && value === 'fixa' && { dataEspecifica: "" })
    }));
  }

  function toggleDiaCircular(dia, index) {
    if (rotinaFormulario.diaSemana.includes(dia)) {
      setRotinaFormulario(prev => ({
        ...prev,
        diaSemana: prev.diaSemana.filter(d => d !== dia),
      }));
      setInicioSelecao(null);
    } else {
      if (inicioSelecao === null) {
        setInicioSelecao(index);
        setRotinaFormulario(prev => ({
          ...prev,
          diaSemana: [dia],
        }));
      } else {
        const fim = index;
        const [start, end] = inicioSelecao < fim ? [inicioSelecao, fim] : [fim, inicioSelecao];
        const diasSelecionados = diasSemana.slice(start, end + 1);
        setRotinaFormulario(prev => ({
          ...prev,
          diaSemana: diasSelecionados,
        }));
        setInicioSelecao(null);
      }
    }
  }

  async function salvarRotina() {
    const { nome, descricao, tipo, diaSemana, dataEspecifica, horaInicio, horaFim } = rotinaFormulario;

    if (!nome || !descricao || !horaInicio || !horaFim) {
      exibirAlerta("Preencha todos os campos obrigatórios!", "danger");
      return;
    }

    if (tipo === 'fixa' && diaSemana.length === 0) {
      exibirAlerta("Selecione pelo menos um dia para rotinas fixas!", "danger");
      return;
    }

    if (tipo === 'especifico' && !dataEspecifica) {
      exibirAlerta("Selecione uma data para eventos específicos!", "danger");
      return;
    }

    try {
      await rotinaService.criarRotinaAsync({
        nome,
        descricao,
        tipo,
        diaSemana: tipo === 'fixa' ? diaSemana : [],
        dataEspecifica: tipo === 'especifico' ? dataEspecifica : null,
        horaInicio,
        horaFim,
        userId,
        createdAt: new Date(),
      });

      exibirAlerta(tipo === 'fixa' ? "Rotina adicionada com sucesso!" : "Evento adicionado com sucesso!", "success");
      setAberto(false);
      carregarRotinas();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      exibirAlerta(`Erro ao salvar ${tipo === 'fixa' ? 'rotina' : 'evento'}`, "danger");
    }
  }

  useEffect(() => {
    if (!aberto) {
      setRotinaFormulario({
        nome: "",
        descricao: "",
        tipo: "fixa",
        diaSemana: [],
        dataEspecifica: "",
        horaInicio: "",
        horaFim: "",
      });
      setInicioSelecao(null);
    }
  }, [aberto]);

  return (
    <div>
      <button className={style.botao_modal} onClick={() => setAberto(true)}>
        <MdOutlineAddCircleOutline />
        Adicionar Rotina/Evento
      </button>

      <AlertaGlobal
        tipo={tipoAlerta}
        mensagem={mensagemAlerta}
        visivel={mostrarAlerta}
        aoFechar={() => setMostrarAlerta(false)}
      />

      {aberto && (
        <div className={style.container_formulario}>
          <ModalGlobal aberto={aberto} setAberto={setAberto} titulo="Adicionar Rotina/Evento">
            <form className={style.formulario}>
              <div className={style.container_campos_formulario}>
                <label>Tipo</label>
                <select
                  name="tipo"
                  value={rotinaFormulario.tipo}
                  onChange={setValorRotina}
                  className={style.select_tipo}
                >
                  <option value="fixa">Rotina Semanal Fixa</option>
                  <option value="especifico">Evento Específico</option>
                </select>
              </div>

              <div className={style.container_campos_formulario}>
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={rotinaFormulario.nome}
                  onChange={setValorRotina}
                  placeholder="Ex: Estudar React"
                />
              </div>

              <div className={style.container_campos_formulario}>
                <label>Descrição</label>
                <textarea
                  name="descricao"
                  value={rotinaFormulario.descricao}
                  onChange={setValorRotina}
                  placeholder="Detalhes da atividade"
                />
              </div>

              {rotinaFormulario.tipo === 'fixa' ? (
                <div className={style.container_campos_formulario}>
                  <label>Dias da Semana</label>
                  <div className={style.diasCirculares}>
                    {diasSemana.map((dia, index) => (
                      <button
                        key={dia}
                        type="button"
                        className={`${style.diaCirculo} ${
                          rotinaFormulario.diaSemana.includes(dia) ? style.ativo : ""
                        }`}
                        onClick={() => toggleDiaCircular(dia, index)}
                      >
                        {dia.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={style.container_campos_formulario}>
                  <label>Data do Evento</label>
                  <input
                    type="date"
                    name="dataEspecifica"
                    value={rotinaFormulario.dataEspecifica}
                    onChange={setValorRotina}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              <div className={style.container_linha}>
                <div className={style.container_campos_formulario}>
                  <label>Hora de Início</label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={rotinaFormulario.horaInicio}
                    onChange={setValorRotina}
                  />
                </div>

                <div className={style.container_campos_formulario}>
                  <label>Hora de Término</label>
                  <input
                    type="time"
                    name="horaFim"
                    value={rotinaFormulario.horaFim}
                    onChange={setValorRotina}
                  />
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
                  className={style.botao_adicionar}
                  onClick={salvarRotina}
                >
                  {rotinaFormulario.tipo === 'fixa' ? 'Adicionar Rotina' : 'Adicionar Evento'}
                </button>
              </div>
            </form>
          </ModalGlobal>
        </div>
      )}
    </div>
  );
}

export default FormularioAdicionarRotina;