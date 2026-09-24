import { Card } from '../ui/Card.jsx'
import { CalendarHeader } from './CalendarHeader.jsx'
import { CalendarGrid } from './CalendarGrid.jsx'
import { SelectionBadge } from './SelectionBadge.jsx'
import { WeekdayHeader } from './WeekdayHeader.jsx'

export function CalendarCard({ month, weeks, selectedDay, disabledDays, onDateSelect }) {
  return (
    <Card className="calendar-card">
      <CalendarHeader month={month} />
      <WeekdayHeader />
      <CalendarGrid weeks={weeks} selectedDay={selectedDay} disabledDays={disabledDays} onDateSelect={onDateSelect} />
      <div className="calendar-badges">
        <SelectionBadge>Qua {selectedDay} selecionado</SelectionBadge>
        <SelectionBadge tone="muted">Dom 20 fechado</SelectionBadge>
      </div>
      <p className="calendar-help">Dias sem expediente ficam indisponíveis.</p>
    </Card>
  )
}
