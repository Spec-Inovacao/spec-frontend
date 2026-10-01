import { request } from './api.js'

export function consultarDisponibilidade(servicoId, data) {
  const params = new URLSearchParams({ servicoId: String(servicoId), data })
  return request(`/Disponibilidade?${params}`)
}

export function consultarDiasDisponiveis(mes) {
  const params = new URLSearchParams({ mes })
  return request(`/Disponibilidade/dias?${params}`)
}

export function normalizarHorarios(payload) {
  const availableItems = payload?.horariosDisponiveis || []
  const blockedItems = payload?.horariosBloqueados || payload?.horariosOcupados || []
  const items = Array.isArray(payload)
    ? payload
    : payload?.horarios || payload?.slots || payload?.disponibilidades || payload?.items || [
      ...availableItems,
      ...blockedItems.map((item) => typeof item === 'object' ? { ...item, disponivel: false } : { hora: item, disponivel: false }),
    ]

  return items.map((item) => {
    const timeValue = typeof item === 'string'
      ? item
      : item.hora || item.horario || item.time || item.dtInicio || item.inicio || ''
    const time = String(timeValue).match(/\d{2}:\d{2}/)?.[0] || ''
    const statusValue = typeof item === 'object' ? item.status : null
    const availableValue = typeof item === 'object'
      ? item.disponivel ?? item.available
      : true
    const blockedStatuses = ['ocupado', 'bloqueado', 'indisponivel', 'indisponível']
    const status = availableValue === false
      || item?.bloqueado === true
      || item?.ocupado === true
      || blockedStatuses.includes(String(statusValue).toLowerCase())
      ? 'occupied'
      : 'available'

    return { time, status }
  }).filter((slot) => slot.time)
}