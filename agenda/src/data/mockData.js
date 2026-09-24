export const mockServices = [
  {
    id: 1,
    nome: 'Consulta',
    descricao: 'Atendimento objetivo para avaliar sua necessidade.',
    tempomin: 30,
    preco: 80,
    ativo: true,
  },
  {
    id: 2,
    nome: 'Avaliação',
    descricao: 'Mais tempo para diagnóstico e orientação inicial.',
    tempomin: 45,
    preco: 120,
    ativo: true,
  },
  {
    id: 3,
    nome: 'Atendimento completo',
    descricao: 'Sessão completa com acompanhamento detalhado.',
    tempomin: 60,
    preco: 180,
    ativo: true,
  },
]

export const mockAvailability = {
  dateLabel: 'Hoje · 14 de setembro',
  slots: ['10:00', '11:30', '15:00'],
  workHours: '09:00–18:00',
  cancellationText: 'Cancelamento permitido até 2 h antes.',
  cancellationHours: 2,
}
