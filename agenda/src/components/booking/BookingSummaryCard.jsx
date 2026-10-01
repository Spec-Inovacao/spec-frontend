import { Card } from '../ui/Card.jsx'
import { StatusBadge } from '../ui/StatusBadge.jsx'
import { CancellationPolicy } from './CancellationPolicy.jsx'
import { SummaryRow } from './SummaryRow.jsx'

export function BookingSummaryCard({ booking, customer, onCustomerChange, minimumHours, onBack, confirming }) {
  const price = Number(booking.service.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  return (
    <Card className="booking-summary-card">
      <div className="booking-summary-header"><h2>Resumo</h2><StatusBadge>Horário disponível</StatusBadge></div>
      <div className="booking-summary-rows">
        <SummaryRow label="Serviço" value={booking.service.nome} />
        <SummaryRow label="Data" value={booking.dateLabel} />
        <SummaryRow label="Horário" value={`${booking.slot.start}–${booking.slot.end}`} />
        <SummaryRow label="Prestador" value="Prestador local" />
        <SummaryRow label="Valor" value={price} />
      </div>
      <div className="customer-fields">
        <h3>Seus dados</h3>
        <label><span>Nome completo</span><input autoComplete="name" name="nome" required value={customer.nome} onChange={onCustomerChange} /></label>
        <label><span>E-mail</span><input autoComplete="email" name="email" required type="email" value={customer.email} onChange={onCustomerChange} /></label>
        <label><span>Telefone</span><input autoComplete="tel" name="telefone" required type="tel" value={customer.telefone} onChange={onCustomerChange} /></label>
      </div>
      <CancellationPolicy minimumHours={minimumHours} />
      <div className="confirmation-actions"><button className="button button-secondary" type="button" onClick={onBack}>Voltar</button><button className="button button-primary" disabled={confirming} type="submit">{confirming ? 'Confirmando...' : 'Confirmar agendamento'}</button></div>
    </Card>
  )
}
