import { useEffect, useState } from 'react'
import { CalendarCard } from '../components/scheduling/CalendarCard.jsx'
import { TimeSlotsCard } from '../components/scheduling/TimeSlotsCard.jsx'
import { consultarDiasDisponiveis, consultarDisponibilidade, extractCalendarData, normalizarHorarios } from '../services/disponibilidade.js'

function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function toDateSet(values, monthKey) {
  if (!Array.isArray(values)) return new Set()
  return new Set(values.map((item) => {
    const raw = typeof item === 'object' && item !== null
      ? item.data || item.date || item.dia || item.dataDisponivel
      : item
    if (typeof raw === 'number' || /^\d{1,2}$/.test(String(raw))) {
      return `${monthKey}-${String(raw).padStart(2, '0')}`
    }
    return String(raw || '').match(/\d{4}-\d{2}-\d{2}/)?.[0] || ''
  }).filter(Boolean))
}

function parseWorkingDays(value) {
  if (value == null || value === '') return null
  const names = { domingo: 0, segunda: 1, terca: 2, terça: 2, quarta: 3, quinta: 4, sexta: 5, sabado: 6, sábado: 6 }
  let values = Array.isArray(value) ? value : String(value).split(/[;,\s]+/)
  if (typeof value === 'string' && value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) values = parsed
    } catch {
      return null
    }
  }
  const parsed = values.flatMap((item) => {
    const normalized = String(item).trim().toLowerCase()
    if (/^[0-6]$/.test(normalized)) return [Number(normalized)]
    const day = Object.entries(names).find(([name]) => normalized.startsWith(name))?.[1]
    return day == null ? [] : [day]
  })
  return parsed.length ? new Set(parsed) : null
}

function makeCalendar(monthKey, availableValues, closedValues, hasAvailableList, workingDays) {
  const [year, month] = monthKey.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const availableDates = toDateSet(availableValues, monthKey)
  const closedDates = toDateSet(closedValues, monthKey)
  const today = localDate(new Date())
  const weeks = []
  const disabledDays = []
  const selectableDates = []
  let week = Array(firstWeekday).fill(null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${monthKey}-${String(day).padStart(2, '0')}`
    const weekday = new Date(`${date}T12:00:00`).getDay()
    const disabled = date < today
      || (workingDays && !workingDays.has(weekday))
      || (hasAvailableList ? !availableDates.has(date) : closedDates.has(date))
    week.push(day)
    if (disabled) disabledDays.push(day)
    else selectableDates.push(date)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)])
  return { weeks, disabledDays, selectableDates }
}

function addMinutes(dateTime, minutes) {
  return new Date(dateTime.getTime() + minutes * 60_000)
}

function timeFromDate(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function EscolherHorario({ configuration, service, onContinue }) {
  const [monthDate, setMonthDate] = useState(() => {
    const date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
  const [calendar, setCalendar] = useState({ weeks: [], disabledDays: [], selectableDates: [] })
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!service?.id) return
    let active = true
    async function loadMonth() {
      setLoading(true)
      setError('')
      setSelectedTime('')
      setSlots([])
      try {
        const payload = await consultarDiasDisponiveis(monthKey)
        const data = extractCalendarData(payload, monthKey)
        const nextCalendar = makeCalendar(monthKey, data.available, data.closed, data.hasAvailableList, parseWorkingDays(configuration?.diasatendimento))
        if (!active) return
        setCalendar(nextCalendar)
        const today = localDate(new Date())
        const preferredDate = nextCalendar.selectableDates.includes(today)
          ? today
          : nextCalendar.selectableDates[0] || ''
        setSelectedDate(preferredDate)
        if (preferredDate) {
          const availability = await consultarDisponibilidade(service.id, preferredDate)
          if (active) setSlots(normalizarHorarios(availability))
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Não foi possível carregar o calendário.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadMonth()
    return () => { active = false }
  }, [service?.id, monthKey, configuration?.diasatendimento])

  async function handleDateSelect(day) {
    if (calendar.disabledDays.includes(day)) return
    const date = `${monthKey}-${String(day).padStart(2, '0')}`
    setSelectedDate(date)
    setSelectedTime('')
    setLoading(true)
    setError('')
    try {
      const availability = await consultarDisponibilidade(service.id, date)
      setSlots(normalizarHorarios(availability))
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os horários deste dia.')
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  function handleContinue() {
    if (!selectedTime || !service || !selectedDate) return
    const start = new Date(`${selectedDate}T${selectedTime}:00`)
    const end = addMinutes(start, Number(service.tempoMin ?? service.tempomin) || 0)
    onContinue({
      service,
      date: selectedDate,
      dateLabel: new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR', { dateStyle: 'full' }),
      slot: { start: selectedTime, end: timeFromDate(end), label: selectedTime },
      dtInicio: `${selectedDate}T${selectedTime}:00`,
      dtFim: `${selectedDate}T${timeFromDate(end)}:00`,
      cancellationMinimumHours: Number(configuration?.cancelamentominhora) || 2,
    })
  }

  if (!service) return <p className="loading page-state">Escolha um serviço antes de selecionar o horário.</p>

  const selectedDay = selectedDate ? Number(selectedDate.slice(-2)) : null
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const canGoPrevious = monthDate > monthStart

  return (
    <main className="schedule-page">
      <div className="page-heading">
        <h1>Escolha data e horário</h1>
        <p>{service.nome} · {service.tempoMin ?? service.tempomin} minutos{configuration?.horainicio && ` · expediente ${configuration.horainicio}–${configuration.horafim}`}</p>
      </div>
      {error && <p className="confirmation-error" role="alert">{error}</p>}
      <div className="schedule-layout">
        <CalendarCard month={monthLabel(monthKey)} monthKey={monthKey} weeks={calendar.weeks} selectedDay={selectedDay} disabledDays={calendar.disabledDays} onDateSelect={handleDateSelect} canGoPrevious={canGoPrevious} onMonthChange={(offset) => setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))} />
        {loading ? <p className="loading page-state">Carregando horários...</p> : <TimeSlotsCard title={selectedDate ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }) : 'Sem datas disponíveis'} description="Horários ocupados ou bloqueados não podem ser selecionados." slots={slots} selectedTime={selectedTime} onTimeSelect={setSelectedTime} onContinue={handleContinue} />}
      </div>
    </main>
  )
}
