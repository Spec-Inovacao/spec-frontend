import { describe, expect, it } from 'vitest'
import { buildSlots, createAgendaService } from './agendaService.js'
import { validateAppointmentWindow, validateCancellation } from '../repositories/agendaRepository.js'

const service = { IDSERVICO: 7, NOME: 'Consulta', PRECO: 90, TEMPOMIN: 60 }
const schedule = { startTime: '08:00', endTime: '12:00', serviceDays: [1, 2, 3, 4, 5], cancellationHours: 24 }
const monday = '2026-09-21'
const future = new Date('2026-09-20T08:00:00')

const slotAt = (time) => new Date(`${monday}T${time}:00`)

function fakeRepository(overrides = {}) {
  return {
    listActiveServices: async () => [service],
    findService: async () => service,
    getScheduleConfig: async () => schedule,
    listAppointmentsForDate: async () => [],
    listBlocksForDate: async () => [],
    listClientAppointments: async () => [],
    createAppointment: async (payload) => ({ id: 9, ...payload, status: 'agendado' }),
    cancelAppointment: async () => ({ id: 9, status: 'cancelado' }),
    ...overrides,
  }
}

describe('disponibilidade', () => {
  it('gera horários somente dentro do expediente e respeita TEMPOMIN', () => {
    const slots = buildSlots({ date: monday, service, schedule, appointments: [], blocks: [], now: future })
    expect(slots).toHaveLength(4)
    expect(slots.every((slot) => slot.available)).toBe(true)
  })

  it('retorna vazio em data sem expediente', () => {
    expect(buildSlots({ date: '2026-09-20', service, schedule, appointments: [], blocks: [], now: future })).toEqual([])
  })

  it('marca horário ocupado por agendamento', () => {
    const slots = buildSlots({
      date: monday,
      service,
      schedule,
      appointments: [{ startAt: slotAt('09:30'), endAt: slotAt('10:30') }],
      blocks: [],
      now: future,
    })
    expect(slots.find((slot) => slot.startAt === slotAt('09:00').toISOString()).available).toBe(false)
    expect(slots.find((slot) => slot.startAt === slotAt('10:00').toISOString()).available).toBe(false)
  })

  it('marca horário ocupado por bloqueio', () => {
    const slots = buildSlots({
      date: monday,
      service,
      schedule,
      appointments: [],
      blocks: [{ startAt: slotAt('10:00'), endAt: slotAt('11:00') }],
      now: future,
    })
    expect(slots.find((slot) => slot.startAt === slotAt('10:00').toISOString()).available).toBe(false)
  })
})

describe('regras de agendamento', () => {
  it('rejeita conflito por sobreposição mesmo com durações diferentes', () => {
    const result = validateAppointmentWindow({
      service,
      config: schedule,
      startAt: slotAt('09:00').toISOString(),
      endAt: slotAt('10:00').toISOString(),
      activeAppointments: [{ startAt: slotAt('09:30'), endAt: slotAt('11:30') }],
      blocks: [],
      now: future,
    })
    expect(result).toMatchObject({ valid: false, code: 'CONFLICT' })
  })

  it('cria um agendamento válido com status agendado', async () => {
    const agenda = createAgendaService(fakeRepository(), { clientId: 3, now: () => future })
    await expect(agenda.createAppointment({ serviceId: 7, startAt: slotAt('08:00').toISOString(), endAt: slotAt('09:00').toISOString() })).resolves.toMatchObject({ status: 'agendado', clientId: 3 })
  })

  it('permite cancelamento dentro da antecedência mínima', () => {
    expect(validateCancellation({ appointment: { status: 'agendado', startAt: '2026-09-25T10:00:00', cancellationHours: 24 }, now: new Date('2026-09-23T09:00:00') })).toEqual({ valid: true })
  })

  it('bloqueia cancelamento fora da antecedência mínima', () => {
    expect(validateCancellation({ appointment: { status: 'agendado', startAt: '2026-09-23T20:00:00', cancellationHours: 24 }, now: new Date('2026-09-23T09:00:00') })).toMatchObject({ valid: false, code: 'CANCELLATION_DEADLINE' })
  })
})
