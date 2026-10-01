import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { criarAgendamento, cancelarAgendamento, listarAgendamentos } from './agendamentos.js'
import { consultarDisponibilidade, consultarDiasDisponiveis, normalizarHorarios } from './disponibilidade.js'
import { buscarConfiguracao } from './configuracao.js'
import { listarServicos } from './servicos.js'
import { criarUsuario } from './usuarios.js'

function response(payload, ok = true) {
  return { ok, json: async () => payload }
}

describe('serviços REST', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([])))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('usa os caminhos REST e parâmetros documentados', async () => {
    await listarServicos()
    await buscarConfiguracao()
    await consultarDisponibilidade(7, '2026-10-01')
    await consultarDiasDisponiveis('2026-10')
    await listarAgendamentos(12)

    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      '/api/Servicos',
      '/api/admin/Configuracao',
      '/api/Disponibilidade?servicoId=7&data=2026-10-01',
      '/api/Disponibilidade/dias?mes=2026-10',
      '/api/Agendamentos?clienteId=12',
    ])
  })

  it('envia payloads JSON e cancela com PATCH', async () => {
    const customer = { nome: 'Ana', email: 'ana@example.com', telefone: '11999990000' }
    const appointment = { clienteId: 12, servicoId: 7, dtInicio: '2026-10-01T10:00:00.000Z', dtFim: '2026-10-01T10:30:00.000Z' }

    await criarUsuario(customer)
    await criarAgendamento(appointment)
    await cancelarAgendamento(31)

    expect(fetch.mock.calls[0][0]).toBe('/api/Usuarios')
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify(customer) })
    expect(fetch.mock.calls[1][0]).toBe('/api/Agendamentos')
    expect(fetch.mock.calls[1][1]).toMatchObject({ method: 'POST', body: JSON.stringify(appointment) })
    expect(fetch.mock.calls[2]).toEqual(['/api/Agendamentos/31/cancelar', { headers: {}, method: 'PATCH' }])
  })

  it('normaliza e bloqueia horários indisponíveis', () => {
    expect(normalizarHorarios({ horarios: [
      { hora: '09:00', disponivel: true },
      { hora: '09:30', bloqueado: true },
    ] })).toEqual([
      { time: '09:00', status: 'available' },
      { time: '09:30', status: 'occupied' },
    ])
  })
})
