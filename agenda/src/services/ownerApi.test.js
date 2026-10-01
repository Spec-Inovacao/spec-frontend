import { afterEach, describe, expect, it, vi } from 'vitest'

async function apiWithBaseUrl() {
  vi.resetModules()
  vi.stubEnv('VITE_OWNER_API_URL', 'https://owner.example')
  return import('./ownerApi.js')
}

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('ownerApi', () => {
  it('sends the normalized configuration payload through the owner base URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ horainicio: '08:00', horafim: '17:00', cancelamentominhora: 2, diasatendimento: ['Seg'] }) })
    vi.stubGlobal('fetch', fetchMock)
    const { ownerApi } = await apiWithBaseUrl()
    await ownerApi.saveConfiguration({ startTime: '08:00', endTime: '17:00', cancellationHours: 2, days: ['Seg'] })
    expect(fetchMock).toHaveBeenCalledWith('https://owner.example/api/admin/Configuracao', expect.objectContaining({ method: 'PUT', body: JSON.stringify({ horainicio: '08:00', horafim: '17:00', cancelamentominhora: 2, diasatendimento: ['Seg'] }) }))
  })

  it('creates appointments with only the contracted body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    const { ownerApi } = await apiWithBaseUrl()
    await ownerApi.createAppointment({ clienteId: 1, servicoId: 2, dtInicio: '2026-10-01T10:00:00', ignored: true })
    expect(fetchMock).toHaveBeenCalledWith('https://owner.example/api/Agendamentos', expect.objectContaining({ method: 'POST', body: JSON.stringify({ clienteId: 1, servicoId: 2, dtInicio: '2026-10-01T10:00:00' }) }))
  })

  it('reports missing administrative configuration explicitly', async () => {
    vi.resetModules(); vi.stubEnv('VITE_OWNER_API_URL', '')
    const { ownerApi } = await import('./ownerApi.js')
    await expect(ownerApi.getAgenda('2026-10-01')).rejects.toMatchObject({ kind: 'configuration' })
  })
})
