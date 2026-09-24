import { CalendarDay } from './CalendarDay.jsx'

export function CalendarGrid({ weeks, selectedDay, disabledDays = [], onDateSelect }) {
  return (
    <div className="calendar-grid" role="grid" aria-label="Dias de setembro de 2026">
      {weeks.flat().map((day) => (
        <CalendarDay key={day} day={day} disabled={disabledDays.includes(day)} selected={day === selectedDay} onClick={onDateSelect} />
      ))}
    </div>
  )
}
