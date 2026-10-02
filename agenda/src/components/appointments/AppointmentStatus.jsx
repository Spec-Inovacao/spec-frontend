import { StatusBadge } from '../ui/StatusBadge.jsx'

export function AppointmentStatus({ allowed, cancelled = false }) {
  if (cancelled) {
    return <StatusBadge className="appointment-status-cancelled">Cancelado</StatusBadge>
  }
  return (
    <StatusBadge className={allowed ? 'appointment-status-allowed' : 'appointment-status-blocked'}>
      {allowed ? 'Cancelamento disponível' : 'Cancelamento bloqueado'}
    </StatusBadge>
  )
}
