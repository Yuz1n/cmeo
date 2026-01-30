'use client'

import { startTransition, useState, useTransition } from "react";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { createEvent, deleteEventAction } from "@/app/actions/event";

// Interface para garantir tipagem dos dados puros (JSON)
interface CalendarProps {
  events: any[]; // Eventos vindos do banco
  users: any[];  // Usuários para o select
}

export function AdminCalendar({ events, users }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isPending, startTransition] = useTransition();

  // Lógica de Geração dos Dias do Calendário
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Filtrar eventos do dia selecionado
  const selectedDayEvents = events.filter(event => 
    selectedDate && isSameDay(new Date(event.start_time), selectedDate)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* COLUNA 1: O CALENDÁRIO VISUAL */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        
        {/* Header do Calendário (Mês e Navegação) */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded text-slate-600">◀</button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded text-slate-600">▶</button>
          </div>
        </div>

        {/* Grid dos Dias da Semana */}
        <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-slate-400 uppercase">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        {/* Grid dos Dias */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            // Verifica se tem evento neste dia
            const hasEvent = events.some(e => isSameDay(new Date(e.start_time), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  h-14 md:h-24 border rounded flex flex-col items-start justify-start p-2 transition-all relative
                  ${!isCurrentMonth ? 'bg-slate-50 text-slate-300' : 'bg-white text-slate-700'}
                  ${isSelected ? 'ring-2 ring-blue-600 z-10' : 'border-slate-100'}
                  hover:bg-blue-50
                `}
              >
                <span className={`text-sm font-bold ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                  {format(day, 'd')}
                </span>
                
                {/* Bolinha indicadora de evento */}
                {hasEvent && (
                  <div className="mt-1 flex gap-1 flex-wrap content-start">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* COLUNA 2: DETALHES E FORMULÁRIO */}
      <div className="w-full lg:w-80 space-y-6">
        
        {/* Formulário de Adicionar Evento */}
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
            Novo Agendamento
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Para: {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
          </p>

          <form action={createEvent} className="space-y-3">
            {/* Campo Oculto com a Data Selecionada */}
            <input type="hidden" name="start_date" value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} />

            <div>
              <label className="text-xs font-bold text-slate-500">Dentista</label>
              <select name="user_id" required className="w-full border p-2 rounded text-sm bg-slate-50 mt-1">
                <option value="">Selecione...</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Título</label>
              <input name="title" required placeholder="Ex: Consulta Rotina" className="w-full border p-2 rounded text-sm mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-500">Hora</label>
                <input name="start_time" type="time" required className="w-full border p-2 rounded text-sm mt-1" />
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-500">Local</label>
                 <input name="location" placeholder="Sala 1" className="w-full border p-2 rounded text-sm mt-1" />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-2 rounded text-sm hover:bg-blue-800 transition-colors">
              Agendar
            </button>
          </form>
        </div>

        {/* Lista de Eventos do Dia Selecionado */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
            Agenda do Dia
          </h3>
          <div className="space-y-3">
            {selectedDayEvents.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum evento neste dia.</p>
            ) : (
              selectedDayEvents.map((evt: any) => (
                <div key={evt.id} className="bg-white p-3 rounded shadow-sm border-l-4 border-blue-500 relative group">
                  <p className="text-xs text-slate-400 font-mono">
                    {format(new Date(evt.start_time), 'HH:mm')}
                  </p>
                  <p className="font-bold text-slate-800 text-sm">{evt.title}</p>
                  <p className="text-xs text-slate-500">{evt.user?.name}</p>
                  {evt.location && <p className="text-xs text-slate-400 mt-1">📍 {evt.location}</p>}
                  <button 
                    onClick={() => startTransition(async () => await deleteEventAction(evt.id))}
                    disabled={isPending}
                    title="Remover evento"
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isPending ? "..." : "✕"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}