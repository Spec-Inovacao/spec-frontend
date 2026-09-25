import { Card } from '../ui/Card.jsx'
import { StatusBadge } from '../ui/StatusBadge.jsx'
import { CancellationPolicy } from './CancellationPolicy.jsx'
import { SummaryRow } from './SummaryRow.jsx'

export function BookingSummaryCard({ booking, minimumHours, onBack, onConfirm, confirming }) {
  return (
    <Card className="booking-summary-card">
      <div className="booking-summary-header"><h2>Resumo</h2><StatusBadge>Horário disponível</StatusBadge></div>
      <div className="booking-summary-rows">
        <SummaryRow label="Serviço" value={booking.service.nome} />
        <SummaryRow label="Data" value={booking.dateLabel} />
        <SummaryRow label="Horário" value={`${booking.slot.start}–${booking.slot.end}`} />
        <SummaryRow label="Prestador" value="Prestador local" />
        <SummaryRow label="Valor" value={`R$ ${booking.service.preco}`} />
      </div>
      <CancellationPolicy minimumHours={minimumHours} />
      <div className="confirmation-actions"><button className="button button-secondary" type="button" onClick={onBack}>Voltar</button><button className="button button-primary" disabled={confirming} type="button" onClick={onConfirm}>{confirming ? 'Confirmando...' : 'Confirmar agendamento'}</button></div>
    </Card>
  )
}
