import { Button } from '../ui/Button.jsx'

export function AppointmentActions({ canCancel, cancelling, onCancel }) {
  if (!canCancel) return null
  return <Button variant="secondary" className="appointment-action-button" disabled={cancelling} onClick={onCancel}>{cancelling ? 'Cancelando...' : 'Cancelar'}</Button>
}
