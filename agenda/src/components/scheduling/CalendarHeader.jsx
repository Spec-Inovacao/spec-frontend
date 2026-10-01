export function CalendarHeader({ month, onMonthChange, canGoPrevious }) {
  return (
    <div className="calendar-header">
      <button className="calendar-month-control" type="button" aria-label="Mês anterior" disabled={!canGoPrevious} onClick={() => onMonthChange(-1)}>‹</button>
      <h2 className="calendar-month">{month}</h2>
      <button className="calendar-month-control" type="button" aria-label="Próximo mês" onClick={() => onMonthChange(1)}>›</button>
    </div>
  )
}
