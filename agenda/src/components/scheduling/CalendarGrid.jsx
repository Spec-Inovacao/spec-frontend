import { CalendarDay } from './CalendarDay.jsx'

export function CalendarGrid({ month, weeks, selectedDay, disabledDays = [], onDateSelect }) {
  return (
    <div className="calendar-grid" role="grid" aria-label={`Dias de ${month}`}>
      {weeks.flatMap((week, weekIndex) => week.map((day, dayIndex) => day ? (
        <CalendarDay key={day} day={day} disabled={disabledDays.includes(day)} selected={day === selectedDay} onClick={onDateSelect} />
      ) : (
        <span key={`empty-${weekIndex}-${dayIndex}`} className="calendar-day-placeholder" aria-hidden="true" />
      )))}
    </div>
  )
}
