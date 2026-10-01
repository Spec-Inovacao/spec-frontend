import { Button } from '../ui/Button.jsx'
import { Card } from '../ui/Card.jsx'
import { TimeSlotGrid } from './TimeSlotGrid.jsx'

export function TimeSlotsCard({ title, description, slots, selectedTime, onTimeSelect, onContinue }) {
  return (
    <Card className="time-slots-card">
      <h2 className="schedule-card-title">{title}</h2>
      <p className="schedule-card-description">{description}</p>
      {slots.length > 0 ? <TimeSlotGrid slots={slots} selectedTime={selectedTime} onTimeSelect={onTimeSelect} /> : <p className="schedule-empty">Nenhum horário disponível nesta data.</p>}
      <div className="schedule-card-footer"><Button disabled={!selectedTime} onClick={onContinue}>Continuar com {selectedTime || '--:--'}</Button></div>
    </Card>
  )
}
