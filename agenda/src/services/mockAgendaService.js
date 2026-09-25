import { mockAvailability, mockServices } from '../data/mockData.js'

export async function listarServicos() {
  return mockServices.filter((service) => service.ativo)
}

export async function consultarDisponibilidade() {
  return mockAvailability
}

export async function listarAgendamentos() {
  return []
}

export async function cancelarAgendamento(id) {
  return { id, status: 'cancelado' }
}
