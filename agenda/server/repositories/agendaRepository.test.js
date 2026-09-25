import { describe, expect, it } from 'vitest'
import { createAgendaRepository } from './agendaRepository.js'

function databaseWithRows(rows) {
  const calls = []
  return {
    calls,
    query: async (text, values) => {
      calls.push({ text, values })
      return { rows }
    },
  }
}

describe('consultas de serviços', () => {
  it('lista somente serviços ativos com query parametrizada', async () => {
    const database = databaseWithRows([{ IDSERVICO: 1, NOME: 'Corte', PRECO: 50, TEMPOMIN: 30 }])
    const repository = createAgendaRepository(database)
    const services = await repository.listActiveServices()

    expect(services).toHaveLength(1)
    expect(database.calls[0].text).toContain('"ATIVO" = $1')
    expect(database.calls[0].values).toEqual([true])
    expect(database.calls[0].text).not.toContain('true')
  })
})
