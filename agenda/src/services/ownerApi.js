const ownerBaseUrl = import.meta.env.VITE_OWNER_API_URL?.replace(/\/$/, '')

export class OwnerApiError extends Error {
  constructor(message, kind = 'api') {
    super(message)
    this.name = 'OwnerApiError'
    this.kind = kind
  }
}

async function ownerRequest(path, options = {}) {
  if (!ownerBaseUrl) throw new OwnerApiError('Configure VITE_OWNER_API_URL para acessar a API administrativa.', 'configuration')
  try {
    const response = await fetch(`${ownerBaseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new OwnerApiError(payload.error || payload.message || 'A API administrativa não pôde concluir a operação.')
    return payload
  } catch (error) {
    if (error instanceof OwnerApiError) throw error
    throw new OwnerApiError('Não foi possível acessar a API administrativa. Verifique a conexão e a configuração de CORS.', 'network')
  }
}

const listFrom = (payload) => Array.isArray(payload) ? payload : (payload?.items || payload?.data || payload?.resultados || [])
const value = (item, names) => names.map((name) => item?.[name]).find((candidate) => candidate !== undefined && candidate !== null)

// AdminAgenda e resumo permanecem sem adaptador semântico até que um payload real seja disponibilizado.
export const normalizeAgenda = (payload) => listFrom(payload).map((item) => ({ raw: item }))
export const normalizeSummary = (payload) => payload && typeof payload === 'object' ? Object.entries(payload).filter(([, item]) => typeof item !== 'object').map(([label, amount]) => ({ label, amount })) : []
export const normalizeConfiguration = (payload = {}) => ({
  startTime: payload.horainicio ?? '', endTime: payload.horafim ?? '',
  cancellationHours: payload.cancelamentominhora ?? '', days: Array.isArray(payload.diasatendimento) ? payload.diasatendimento : [],
})
export const normalizeUsers = (payload) => listFrom(payload).map((item) => ({ id: value(item, ['id', 'idUsuario', 'idusuario', 'clienteId']), name: value(item, ['nome', 'name', 'nomeCompleto']) ?? String(value(item, ['id', 'idUsuario']) ?? '') })).filter((item) => item.id !== undefined)
export const normalizeServices = (payload) => listFrom(payload).map((item) => ({ id: value(item, ['id', 'idServico', 'idservico', 'servicoId']), name: value(item, ['nome', 'name', 'descricao']) ?? String(value(item, ['id', 'idServico']) ?? '') })).filter((item) => item.id !== undefined)
export const normalizeAvailability = (payload) => listFrom(payload).map((item) => typeof item === 'string' ? item : value(item, ['dtInicio', 'dataHora', 'horario', 'hora'])).filter(Boolean)

export const ownerApi = {
  getAgenda: (date) => ownerRequest(`/api/admin/AdminAgenda?data=${encodeURIComponent(date)}`).then(normalizeAgenda),
  getSummary: (date) => ownerRequest(`/api/admin/AdminAgenda/resumo?data=${encodeURIComponent(date)}`).then(normalizeSummary),
  getConfiguration: () => ownerRequest('/api/admin/Configuracao').then(normalizeConfiguration),
  saveConfiguration: (configuration) => ownerRequest('/api/admin/Configuracao', { method: 'PUT', body: JSON.stringify({ horainicio: configuration.startTime, horafim: configuration.endTime, cancelamentominhora: configuration.cancellationHours, diasatendimento: configuration.days }) }).then(normalizeConfiguration),
  listUsers: () => ownerRequest('/api/Usuarios').then(normalizeUsers),
  listServices: () => ownerRequest('/api/Servicos').then(normalizeServices),
  getAvailability: (serviceId, date) => ownerRequest(`/api/Agendamentos/disponibilidade?servicoId=${encodeURIComponent(serviceId)}&data=${encodeURIComponent(date)}`).then(normalizeAvailability),
  createAppointment: ({ clienteId, servicoId, dtInicio }) => ownerRequest('/api/Agendamentos', { method: 'POST', body: JSON.stringify({ clienteId, servicoId, dtInicio }) }),
}
