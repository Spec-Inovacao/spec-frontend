const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Não foi possível concluir a operação')
  return payload
}

export const agendaApi = {
  listServices: () => request('/services'),
  getAvailability: (serviceId, date) => request(`/availability?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`),
  createAppointment: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  listAppointments: () => request('/appointments'),
  cancelAppointment: (id) => request(`/appointments/${encodeURIComponent(id)}/cancel`, { method: 'POST' }),
}
