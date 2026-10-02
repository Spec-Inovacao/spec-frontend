import { request } from './api.js'

function monthNumberFrom(mes) {
  const value = String(mes ?? '')
  if (value.includes('-')) {
    const [, month] = value.split('-')
    return Number(month)
  }
  return Number(value)
}

export function consultarDisponibilidade(servicoId, data) {
  const params = new URLSearchParams({ servicoId: String(servicoId), data })
  return request(`/Disponibilidade?${params}`)
}

export function consultarDiasDisponiveis(mes) {
  const params = new URLSearchParams({ mes: String(monthNumberFrom(mes)) })
  return request(`/Disponibilidade/dias?${params}`)
}

export function extractCalendarData(payload, monthKey = '') {
  if (Array.isArray(payload) && payload.every((item) => typeof item === 'string')) {
    const available = []
    const closed = []
    payload.forEach((item) => {
      const match = String(item).match(/(\d{1,2})\s+(aberto|fechado)/i)
      if (!match) return
      const date = monthKey
        ? `${monthKey}-${match[1].padStart(2, '0')}`
        : match[1]
      if (/fechado/i.test(match[2])) closed.push(date)
      else available.push(date)
    })
    return { available, closed, hasAvailableList: true }
  }

  if (Array.isArray(payload)) {
    const available = []
    const closed = []
    payload.forEach((item) => {
      if (typeof item === 'object' && item !== null && (item.disponivel === false || item.status === 'fechado')) closed.push(item)
      else available.push(item)
    })
    return { available, closed, hasAvailableList: true }
  }

  const available = payload?.diasDisponiveis || payload?.datasDisponiveis || payload?.dias || payload?.datas || null
  const closed = payload?.diasFechados || payload?.datasFechadas || payload?.diasIndisponiveis || []
  return { available: available || [], closed, hasAvailableList: Array.isArray(available) }
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
