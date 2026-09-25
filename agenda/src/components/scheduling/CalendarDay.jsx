export function CalendarDay({ day, selected = false, disabled = false, onClick }) {
  return (
    <button className={`calendar-day ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`.trim()} disabled={disabled} type="button" onClick={() => onClick?.(day)}>
      {day}
    </button>
  )
}
