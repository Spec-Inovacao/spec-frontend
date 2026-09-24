import { TimeSlotButton } from './TimeSlotButton.jsx'

export function TimeSlotGrid({ slots, selectedTime, onTimeSelect }) {
  return (
    <div className="time-slot-grid">
      {slots.map((slot) => <TimeSlotButton key={slot.time} time={slot.time} status={selectedTime === slot.time ? 'selected' : slot.status} onClick={onTimeSelect} />)}
    </div>
  )
}
