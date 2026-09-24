import { AppointmentCard } from './AppointmentCard.jsx'

export function AppointmentList({ appointments, cancellingId, onCancel, onShowPolicy }) {
  return <div className="appointment-list">{appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} cancelling={cancellingId === appointment.id} onCancel={onCancel} onShowPolicy={onShowPolicy} />)}</div>
}
