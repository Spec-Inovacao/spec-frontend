const mockSchedule = {
  service: {
    id: 1,
    nome: 'Consulta',
    descricao: 'Atendimento objetivo para avaliar sua necessidade.',
    tempomin: 30,
    preco: 80,
    ativo: true,
  },
  month: 'Setembro de 2026',
  date: '2026-09-16',
  dateLabel: 'Quarta-feira, 16/09',
  cancellationMinimumHours: 2,
  workHours: { start: '09:00', end: '18:00' },
  weeks: [[7, 8, 9, 10, 11, 12, 13], [14, 15, 16, 17, 18, 19, 20]],
  disabledDays: [20],
  slots: [
    { time: '09:00', status: 'available' },
    { time: '09:30', status: 'available' },
    { time: '10:00', status: 'occupied' },
    { time: '10:30', status: 'available' },
    { time: '11:00', status: 'available' },
    { time: '11:30', status: 'selected' },
    { time: '12:00', status: 'available' },
    { time: '14:00', status: 'occupied' },
    { time: '14:30', status: 'available' },
    { time: '15:00', status: 'available' },
    { time: '16:30', status: 'available' },
    { time: '17:30', status: 'available' },
  ],
}

export async function getMockSchedule() {
  return structuredClone(mockSchedule)
}

export async function listarDisponibilidade() {
  return getMockSchedule()
}
