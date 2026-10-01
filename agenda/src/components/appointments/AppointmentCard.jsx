import { AppointmentActions } from './AppointmentActions.jsx'
import { AppointmentStatus } from './AppointmentStatus.jsx'
import { formatAppointmentDate, formatAppointmentTime, formatCancellationMessage } from '../../utils/appointmentFormatters.js'

export function AppointmentCard({ appointment, cancelling, minimumHours, onCancel }) {
  const allowed = appointment.podeCancelar === true
  const canCancel = allowed && String(appointment.status).toLowerCase() !== 'cancelado'
  const serviceName = appointment.nomeServico || appointment.servico?.nome || 'Serviço'
  return (
    <article className="appointment-card">
      <div className="appointment-card-info">
        <h2>{serviceName}</h2>
        <p className="appointment-date">{formatAppointmentDate(appointment)} · {formatAppointmentTime(appointment)}</p>
        <p className={`appointment-cancellation ${allowed ? 'allowed' : 'blocked'}`}>{formatCancellationMessage({ ...appointment, minimumHours })}</p>
      </div>
      <div className="appointment-card-actions">
        <AppointmentStatus allowed={allowed} />
        <AppointmentActions canCancel={canCancel} cancelling={cancelling} onCancel={() => onCancel(appointment)} />
      </div>
    </article>
  )
}
