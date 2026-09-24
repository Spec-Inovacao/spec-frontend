import { schema } from '../config.js'

const durationColumn = schema.services.duration

export function createAgendaService(repository, { clientId, now = () => new Date() }) {
  return {
    listServices: () => repository.listActiveServices(),

    async getAvailability(date, serviceId) {
      assertDate(date)
      const service = await repository.findService(Number(serviceId))
      if (!service) {
        const error = new Error('Serviço ativo não encontrado')
        error.code = 'SERVICE_NOT_FOUND'
        throw error
      }
      const schedule = await repository.getScheduleConfig()
      const appointments = await repository.listAppointmentsForDate(date)
      const blocks = await repository.listBlocksForDate(date)
      return {
        date,
        serviceId: Number(serviceId),
        cancellationHours: schedule?.cancellationHours ?? null,
        slots: buildSlots({ date, service, schedule, appointments, blocks, now: now() }),
      }
    },

    createAppointment: (payload) => repository.createAppointment({ ...payload, clientId }, now()),
    listAppointments: () => repository.listClientAppointments(clientId),
    cancelAppointment: (appointmentId) => repository.cancelAppointment(Number(appointmentId), clientId, now()),
  }
}

export function buildSlots({ date, service, schedule, appointments, blocks, now = new Date() }) {
  if (!schedule || !isServiceDay(date, schedule.serviceDays)) return []
  const duration = Number(service[durationColumn])
  const opening = timeToMinutes(schedule.startTime)
  const closing = timeToMinutes(schedule.endTime)
  const slots = []

  for (let start = opening; start + duration <= closing; start += duration) {
    const startAt = toDateTime(date, start)
    const endAt = toDateTime(date, start + duration)
    const occupied = startAt <= now
      || appointments.some((item) => overlaps(startAt, endAt, item.startAt, item.endAt))
      || blocks.some((item) => overlaps(startAt, endAt, item.startAt, item.endAt))
    slots.push({
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      available: !occupied,
    })
  }
  return slots
}

function assertDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(toDateTime(date, 0).getTime())) {
    const error = new Error('Data inválida')
    error.code = 'INVALID_DATE'
    throw error
  }
}

function isServiceDay(date, value) {
  const days = Array.isArray(value)
    ? value.map(Number)
    : String(value ?? '').split(',').map((day) => Number(day.trim()))
  return days.includes(toDateTime(date, 12).getDay())
}

function overlaps(start, end, otherStart, otherEnd) {
  return start < new Date(otherEnd) && end > new Date(otherStart)
}

function toDateTime(date, minutes) {
  const [year, month, day] = date.split('-').map(Number)
  const result = new Date(year, month - 1, day, 0, 0, 0, 0)
  result.setMinutes(minutes)
  return result
}

function timeToMinutes(value) {
  const [hours, minutes] = String(value).slice(0, 5).split(':').map(Number)
  return hours * 60 + minutes
}
