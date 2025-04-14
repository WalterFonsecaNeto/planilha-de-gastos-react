import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addWeeks from 'date-fns/addWeeks';
import addDays from 'date-fns/addDays';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import style from './CalendarioRotinas.module.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'pt-BR': ptBR },
});

const toCamelCase = (str) => {
  return str.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
};

const formats = {
  timeGutterFormat: 'HH:mm',
  eventTimeRangeFormat: ({ start, end }) =>
    `${format(start, 'HH:mm', { locale: ptBR })} - ${format(end, 'HH:mm', { locale: ptBR })}`,
  dayFormat: (date) => toCamelCase(format(date, 'EEEE', { locale: ptBR })),
  weekdayFormat: (date) => toCamelCase(format(date, 'EEEE', { locale: ptBR })),
};

function CalendarioRotinas({ rotinas }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = (action) => {
    if (action === 'PREV') setCurrentDate(addWeeks(currentDate, -1));
    if (action === 'NEXT') setCurrentDate(addWeeks(currentDate, 1));
    if (action === 'TODAY') setCurrentDate(new Date());
  };

  const eventos = rotinas.map(rotina => {
    try {
      if (rotina.tipo === 'fixa') {
        return rotina.diaSemana?.map(dia => {
          const diasMap = {
            'Segunda': 1, 'Terça': 2, 'Quarta': 3,
            'Quinta': 4, 'Sexta': 5, 'Sábado': 6, 'Domingo': 0
          };

          if (!(dia in diasMap)) return null;

          const date = new Date(currentDate);
          const diaAlvo = diasMap[dia];
          const diff = (diaAlvo - date.getDay() + 7) % 7;
          date.setDate(date.getDate() + diff);

          const [horaInicio, minutoInicio] = (rotina.horaInicio || '00:00').split(':').map(Number);
          const [horaFim, minutoFim] = (rotina.horaFim || '23:59').split(':').map(Number);

          date.setHours(horaInicio, minutoInicio, 0);
          const endDate = new Date(date);
          endDate.setHours(horaFim, minutoFim, 0);

          return {
            title: rotina.nome || 'Sem nome',
            start: date,
            end: endDate,
            allDay: false,
            resource: rotina,
          };
        }).filter(Boolean);
      } else {
        if (!rotina.dataEspecifica) return null;

        const [ano, mes, dia] = rotina.dataEspecifica.split('-').map(Number);
        const [horaInicio, minutoInicio] = (rotina.horaInicio || '00:00').split(':').map(Number);
        const [horaFim, minutoFim] = (rotina.horaFim || '23:59').split(':').map(Number);

        const start = new Date(ano, mes - 1, dia, horaInicio, minutoInicio);
        const end = new Date(ano, mes - 1, dia, horaFim, minutoFim);

        return {
          title: rotina.nome || 'Sem nome',
          start,
          end,
          allDay: false,
          resource: rotina,
        };
      }
    } catch (error) {
      console.error('Erro ao processar rotina:', error);
      return null;
    }
  }).flat().filter(Boolean);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.resource.tipo === 'fixa' ? '#e0f2fe' : '#f0fdf4',
      borderColor: event.resource.tipo === 'fixa' ? '#1d4ed8' : '#16a34a',
      color: event.resource.tipo === 'fixa' ? '#1d4ed8' : '#166534',
      borderRadius: '6px',
      padding: '4px 8px',
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  });

  return (
    <div className={style.calendario_container}>
      <div className={style.controles_navegacao}>
        <button className={style.botao_navegacao} onClick={() => navigate('PREV')}>
          ◄ Semana Anterior
        </button>
        <button className={style.botao_navegacao} onClick={() => navigate('TODAY')}>
          Hoje
        </button>
        <button className={style.botao_navegacao} onClick={() => navigate('NEXT')}>
          Próxima Semana ►
        </button>
      </div>
      <div className={style.calendario_wrapper}>
        <Calendar
          className={style.calendario_personalizado}
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['week']}
          date={currentDate}
          onNavigate={setCurrentDate}
          min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}
          messages={{
            week: 'Semana',
            previous: '',
            next: '',
            today: '',
            date: 'Data',
            time: 'Hora',
            event: 'Evento',
            month: 'Mês',
            day: 'Dia',
            agenda: 'Agenda',
            noEventsInRange: 'Nenhum evento neste período.',
          }}
          culture="pt-BR"
          components={{
            toolbar: () => null,
            timeGutterHeader: () => (
              <div className={style.horario_header_container}>
                <span className={style.horario_header_text}>Horário</span>
              </div>
            ),
            header: ({ date }) => {
              const diaSemana = format(date, 'EEEE', { locale: ptBR });
              const dataFormatada = format(date, 'dd/MM');
              const hoje = new Date();
              const isHoje = format(date, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd');

              return (
                <div className={`${style.custom_header} ${isHoje ? style.dia_hoje : ''}`}>
                  <div className={style.header_dia}>{toCamelCase(diaSemana)}</div>
                  <div className={style.header_data}>{dataFormatada}</div>
                </div>
              );
            },
          }}
          formats={formats}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}

export default CalendarioRotinas;
