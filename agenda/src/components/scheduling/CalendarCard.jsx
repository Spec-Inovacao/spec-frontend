import { Card } from '../ui/Card.jsx'
import { CalendarHeader } from './CalendarHeader.jsx'
import { CalendarGrid } from './CalendarGrid.jsx'
import { SelectionBadge } from './SelectionBadge.jsx'
import { WeekdayHeader } from './WeekdayHeader.jsx'

export function CalendarCard({ month, monthKey, weeks, selectedDay, disabledDays, onDateSelect, onMonthChange, canGoPrevious }) {
  return (
    <Card className="calendar-card">
      <CalendarHeader month={month} onMonthChange={onMonthChange} canGoPrevious={canGoPrevious} />
      <WeekdayHeader />
      <CalendarGrid month={month} weeks={weeks} selectedDay={selectedDay} disabledDays={disabledDays} onDateSelect={onDateSelect} />
      <div className="calendar-badges">
        {selectedDay && <SelectionBadge>{new Date(`${monthKey}-${String(selectedDay).padStart(2, '0')}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })} selecionado</SelectionBadge>}
        <SelectionBadge tone="muted">Dias sem expediente fechados</SelectionBadge>
      </div>
      <p className="calendar-help">Dias sem expediente ficam indisponíveis.</p>
    </Card>
  )
}
