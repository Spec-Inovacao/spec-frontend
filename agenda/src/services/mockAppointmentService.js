const mockAppointments = [
  {
    id: 1,
    servico: { id: 2, nome: 'Avaliação', tempomin: 45, preco: 120 },
    dtInicio: '2026-09-14T10:30:00-03:00',
    dtFim: '2026-09-14T11:15:00-03:00',
    status: 'agendado',
    dateLabel: 'Hoje, 14/09',
    cancellation: { allowed: false, hoursRemaining: 1.03, minimumHours: 2, message: 'Falta 1h02 · mínimo exigido: 2h' },
  },
  {
    id: 2,
    servico: { id: 1, nome: 'Consulta', tempomin: 30, preco: 80 },
    dtInicio: '2026-09-15T15:00:00-03:00',
    dtFim: '2026-09-15T15:30:00-03:00',
    status: 'agendado',
    dateLabel: 'Terça-feira, 15/09',
    cancellation: { allowed: true, hoursRemaining: 30, minimumHours: 2, message: 'Faltam mais de 24h' },
  },
]

export async function listarAgendamentos() {
  return structuredClone(mockAppointments)
}

export async function cancelarAgendamento(id) {
  const appointment = mockAppointments.find((item) => item.id === id)
  if (!appointment || !appointment.cancellation.allowed) {
    throw new Error('Este agendamento não pode ser cancelado neste momento.')
  }
  appointment.status = 'cancelado'
  return structuredClone(appointment)
}

export function adicionarAgendamento(appointment) {
  mockAppointments.unshift(appointment)
}
