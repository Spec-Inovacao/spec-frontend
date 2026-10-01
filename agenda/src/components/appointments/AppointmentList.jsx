import { AppointmentCard } from './AppointmentCard.jsx'

export function AppointmentList({ appointments, cancellingId, minimumHours, onCancel }) {
  return <div className="appointment-list">{appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} cancelling={cancellingId === appointment.id} minimumHours={minimumHours} onCancel={onCancel} />)}</div>
}
