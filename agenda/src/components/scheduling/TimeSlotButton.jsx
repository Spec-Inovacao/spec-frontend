export function TimeSlotButton({ time, status = 'available', onClick }) {
  const disabled = status === 'occupied'
  return <button className={`time-slot time-slot-${status}`} disabled={disabled} type="button" onClick={() => onClick?.(time)}>{time}</button>
}
