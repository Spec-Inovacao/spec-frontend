import { request } from './api.js'

export function listarAgendamentos(clienteId) {
  const params = new URLSearchParams({ clienteId: String(clienteId) })
  return request(`/Agendamentos?${params}`)
}

export function criarAgendamento(agendamento) {
  return request('/Agendamentos', {
    method: 'POST',
    body: JSON.stringify(agendamento),
  })
}

export function cancelarAgendamento(id) {
  return request(`/Agendamentos/${encodeURIComponent(id)}/cancelar`, {
    method: 'PATCH',
  })
}