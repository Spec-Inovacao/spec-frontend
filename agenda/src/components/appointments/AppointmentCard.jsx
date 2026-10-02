import { AppointmentActions } from './AppointmentActions.jsx'
import { AppointmentStatus } from './AppointmentStatus.jsx'
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatCancellationMessage,
  isAppointmentCancelled,
} from '../../utils/appointmentFormatters.js'

export function AppointmentCard({ appointment, cancelling, minimumHours, onCancel }) {
  const cancelled = isAppointmentCancelled(appointment)
  const allowed = !cancelled && appointment.podeCancelar === true
  const canCancel = allowed
  const serviceName = appointment.nomeServico || appointment.servico?.nome || 'Serviço'
  const messageTone = cancelled ? 'cancelled' : allowed ? 'allowed' : 'blocked'

  return (
    <article className={`appointment-card${cancelled ? ' cancelled' : ''}`}>
      <div className="appointment-card-info">
        <h2>{serviceName}</h2>
        <p className="appointment-date">{formatAppointmentDate(appointment)} · {formatAppointmentTime(appointment)}</p>
        <p className={`appointment-cancellation ${messageTone}`}>{formatCancellationMessage({ ...appointment, minimumHours })}</p>
      </div>
      <div className="appointment-card-actions">
        <AppointmentStatus allowed={allowed} cancelled={cancelled} />
        <AppointmentActions canCancel={canCancel} cancelling={cancelling} onCancel={() => onCancel(appointment)} />
      </div>
    </article>
  )
}
