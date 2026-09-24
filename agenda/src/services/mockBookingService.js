import { adicionarAgendamento } from './mockAppointmentService.js'

export async function confirmarAgendamentoMock(booking) {
  const confirmed = { ...booking, status: 'agendado', id: Date.now() }
  adicionarAgendamento({
    id: confirmed.id,
    servico: confirmed.service,
    dtInicio: `${confirmed.date}T${confirmed.slot.start}:00-03:00`,
    dtFim: `${confirmed.date}T${confirmed.slot.end}:00-03:00`,
    status: 'agendado',
    dateLabel: confirmed.dateLabel,
    cancellation: { allowed: true, hoursRemaining: 30, minimumHours: confirmed.cancellationMinimumHours, message: 'Faltam mais de 24h' },
  })
  return confirmed
}
