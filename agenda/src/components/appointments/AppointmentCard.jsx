import { AppointmentActions } from './AppointmentActions.jsx'
import { AppointmentStatus } from './AppointmentStatus.jsx'
import { formatAppointmentDate, formatAppointmentTime, formatCancellationMessage } from '../../utils/appointmentFormatters.js'

export function AppointmentCard({ appointment, cancelling, onCancel, onShowPolicy }) {
  const canCancel = appointment.status === 'agendado' && appointment.cancellation.allowed
  return (
    <article className="appointment-card">
      <div className="appointment-card-info">
        <h2>{appointment.servico.nome}</h2>
        <p className="appointment-date">{formatAppointmentDate(appointment)} · {formatAppointmentTime(appointment)}</p>
        <p className={`appointment-cancellation ${appointment.cancellation.allowed ? 'allowed' : 'blocked'}`}>{formatCancellationMessage(appointment)}</p>
      </div>
      <div className="appointment-card-actions">
        <AppointmentStatus allowed={appointment.cancellation.allowed} />
        <AppointmentActions canCancel={canCancel} cancelling={cancelling} onCancel={() => onCancel(appointment)} onShowPolicy={() => onShowPolicy(appointment)} />
      </div>
    </article>
  )
}
