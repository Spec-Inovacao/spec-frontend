export function isAppointmentCancelled(appointment) {
  return String(appointment?.status || '').toLowerCase() === 'cancelado'
}

export function formatAppointmentDate(appointment) {
  return appointment.dateLabel || new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(appointment.dtInicio))
}

export function formatAppointmentTime(appointment) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(appointment.dtInicio))
}

export function formatCancellationMessage(appointment) {
  if (isAppointmentCancelled(appointment)) return 'Este agendamento foi cancelado.'
  if (appointment.cancellation?.message) return appointment.cancellation.message
  if (appointment.podeCancelar === true) return 'Cancelamento disponível dentro do prazo permitido.'
  return `Cancelamento bloqueado. É necessário cancelar com antecedência mínima de ${appointment.minimumHours || 2} h.`
}
