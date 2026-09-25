import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './app.js'

const activeService = { IDSERVICO: 1, NOME: 'Corte', PRECO: 50, TEMPOMIN: 30 }

function repository() {
  return {
    listActiveServices: async () => [activeService],
    findService: async () => activeService,
    getScheduleConfig: async () => ({ startTime: '08:00', endTime: '18:00', serviceDays: [1, 2, 3, 4, 5], cancellationHours: 24 }),
    listAppointmentsForDate: async () => [],
    listBlocksForDate: async () => [],
    listClientAppointments: async () => [],
    createAppointment: async ({ clientId, ...payload }) => ({ id: 2, clientId, ...payload, status: 'agendado' }),
    cancelAppointment: async () => ({ id: 2, status: 'cancelado' }),
  }
}

describe('API do cliente', () => {
  it('lista serviços ativos', async () => {
    const response = await request(createApp({ repository: repository(), clientId: 1 })).get('/api/services')
    expect(response.status).toBe(200)
    expect(response.body.services).toEqual([activeService])
  })

  it('cria um agendamento válido e encaminha o cliente temporário', async () => {
    const response = await request(createApp({ repository: repository(), clientId: 1 }))
      .post('/api/appointments')
      .send({ serviceId: 1, startAt: '2026-09-21T10:00:00.000Z', endAt: '2026-09-21T10:30:00.000Z' })
    expect(response.status).toBe(201)
    expect(response.body.appointment).toMatchObject({ status: 'agendado', clientId: 1 })
  })

  it('cancela um agendamento permitido pelo backend', async () => {
    const response = await request(createApp({ repository: repository(), clientId: 1 })).post('/api/appointments/2/cancel')
    expect(response.status).toBe(200)
    expect(response.body.appointment.status).toBe('cancelado')
  })
})
