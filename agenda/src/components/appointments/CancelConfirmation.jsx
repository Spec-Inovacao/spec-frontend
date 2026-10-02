import { Button } from '../ui/Button.jsx'

export function CancelConfirmation({ appointment, confirming, onConfirm, onDismiss }) {
  if (!appointment) return null

  const serviceName = appointment.nomeServico || appointment.servico?.nome || 'este agendamento'

  return (
    <div className="appointments-confirm" role="dialog" aria-modal="true" aria-labelledby="cancel-confirm-title">
      <div className="appointments-confirm-panel">
        <h2 id="cancel-confirm-title">Cancelar agendamento?</h2>
        <p>Deseja realmente cancelar <strong>{serviceName}</strong>? Esta ação não pode ser desfeita.</p>
        <div className="appointments-confirm-actions">
          <Button variant="secondary" disabled={confirming} onClick={onDismiss}>Desistir</Button>
          <Button disabled={confirming} onClick={onConfirm}>{confirming ? 'Cancelando...' : 'Confirmar cancelamento'}</Button>
        </div>
      </div>
    </div>
  )
}
