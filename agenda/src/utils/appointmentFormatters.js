export function formatAppointmentDate(appointment) {
  return appointment.dateLabel || new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(appointment.dtInicio))
}

export function formatAppointmentTime(appointment) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(appointment.dtInicio))
}

export function formatCancellationMessage(appointment) {
  return appointment.cancellation.message
}
