const weekdays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

export function WeekdayHeader() {
  return <div className="weekday-header">{weekdays.map((weekday) => <span key={weekday}>{weekday}</span>)}</div>
}
