import { useEffect, useState } from 'react'
import { CalendarCard } from '../components/scheduling/CalendarCard.jsx'
import { TimeSlotsCard } from '../components/scheduling/TimeSlotsCard.jsx'
import { getMockSchedule, listarDisponibilidade } from '../services/mockScheduleService.js'

export function EscolherHorario({ service, onContinue }) {
  const [schedule, setSchedule] = useState(null)
  const [selectedDay, setSelectedDay] = useState(16)
  const [selectedTime, setSelectedTime] = useState('11:30')

  useEffect(() => {
    getMockSchedule().then((initialSchedule) => {
      setSchedule({ ...initialSchedule, service: service || initialSchedule.service })
    })
  }, [service])

  async function handleDateSelect(day) {
    if (day === 20) return
    setSelectedDay(day)
    const nextSchedule = await listarDisponibilidade(schedule.service.id, `2026-09-${String(day).padStart(2, '0')}`)
    setSchedule((current) => ({ ...current, ...nextSchedule, service: current.service }))
    setSelectedTime(nextSchedule.slots.find((slot) => slot.status === 'selected')?.time || '')
  }

  function handleContinue() {
    if (!selectedTime || !schedule) return
    const slotIndex = schedule.slots.findIndex((slot) => slot.time === selectedTime)
    const nextSlot = schedule.slots[slotIndex + 1]
    onContinue({
      service: schedule.service,
      date: `2026-09-${String(selectedDay).padStart(2, '0')}`,
      dateLabel: selectedDay === 16 ? 'Quarta-feira, 16/09/2026' : `Dia ${selectedDay}/09/2026`,
      slot: {
        start: selectedTime,
        end: nextSlot?.time || selectedTime,
        label: selectedTime,
      },
      cancellationMinimumHours: schedule.cancellationMinimumHours,
    })
  }

  if (!schedule) return <p className="loading page-state">Carregando horários...</p>

  return (
    <main className="schedule-page">
      <div className="page-heading">
        <h1>Escolha data e horário</h1>
        <p>{schedule.service.nome} · {schedule.service.tempomin} minutos · somente vagas dentro de {schedule.workHours.start}–{schedule.workHours.end}</p>
      </div>
      <div className="schedule-layout">
        <CalendarCard month={schedule.month} weeks={schedule.weeks} selectedDay={selectedDay} disabledDays={schedule.disabledDays} onDateSelect={handleDateSelect} />
        <TimeSlotsCard title={selectedDay === 16 ? schedule.dateLabel : `Dia ${selectedDay}/09`} description="Horários ocupados são bloqueados para evitar conflito." slots={schedule.slots} selectedTime={selectedTime} onTimeSelect={setSelectedTime} onContinue={handleContinue} />
      </div>
    </main>
  )
}
