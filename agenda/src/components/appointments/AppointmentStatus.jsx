import { StatusBadge } from '../ui/StatusBadge.jsx'

export function AppointmentStatus({ allowed }) {
  return <StatusBadge className={allowed ? 'appointment-status-allowed' : 'appointment-status-blocked'}>{allowed ? 'Cancelamento disponível' : 'Cancelamento bloqueado'}</StatusBadge>
}
