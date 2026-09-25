import { Button } from '../ui/Button.jsx'

export function AppointmentActions({ canCancel, cancelling, onCancel, onShowPolicy }) {
  return canCancel ? (
    <Button variant="secondary" className="appointment-action-button" disabled={cancelling} onClick={onCancel}>{cancelling ? 'Cancelando...' : 'Cancelar'}</Button>
  ) : (
    <Button variant="secondary" className="appointment-action-button" onClick={onShowPolicy}>Ver política</Button>
  )
}
