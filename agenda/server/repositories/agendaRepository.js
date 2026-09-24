import { identifier, schema } from '../config.js'

const services = schema.services
const schedule = schema.config
const appointments = schema.appointments
const blocks = schema.blocks

const serviceColumns = [services.id, services.name, services.description, services.price, services.duration]
  .map(identifier)
  .join(', ')

export function createAgendaRepository(database) {
  return {
    async listActiveServices() {
      const result = await database.query(
        `SELECT ${serviceColumns}
         FROM ${identifier(services.table)}
         WHERE ${identifier(services.active)} = $1
         ORDER BY ${identifier(services.name)}`,
        [true],
      )
      return result.rows
    },

    async findService(serviceId, client = database) {
      const result = await client.query(
        `SELECT ${serviceColumns}
         FROM ${identifier(services.table)}
         WHERE ${identifier(services.id)} = $1
           AND ${identifier(services.active)} = $2`,
        [serviceId, true],
      )
      return result.rows[0] ?? null
    },

    async getScheduleConfig(client = database) {
      const result = await client.query(
        `SELECT ${identifier(schedule.start)} AS "startTime",
                ${identifier(schedule.end)} AS "endTime",
                ${identifier(schedule.days)} AS "serviceDays",
                ${identifier(schedule.cancellationHours)} AS "cancellationHours"
         FROM ${identifier(schedule.table)}
         LIMIT 1`,
      )
      return result.rows[0] ?? null
    },

    async listAppointmentsForDate(date, client = database) {
      const result = await client.query(
        `SELECT ${identifier(appointments.start)} AS "startAt",
                ${identifier(appointments.end)} AS "endAt"
         FROM ${identifier(appointments.table)}
         WHERE ${identifier(appointments.status)} = $1
           AND ${identifier(appointments.start)} < ($2::date + INTERVAL '1 day')
           AND ${identifier(appointments.end)} > $2::date`,
        ['agendado', date],
      )
      return result.rows
    },

    async listBlocksForDate(date, client = database) {
      const result = await client.query(
        `SELECT ${identifier(blocks.start)} AS "startAt",
                ${identifier(blocks.end)} AS "endAt"
         FROM ${identifier(blocks.table)}
         WHERE ${identifier(blocks.start)} < ($1::date + INTERVAL '1 day')
           AND ${identifier(blocks.end)} > $1::date`,
        [date],
      )
      return result.rows
    },

    async listClientAppointments(clientId) {
      const result = await database.query(
        `SELECT a.${identifier(appointments.id)} AS "id",
                a.${identifier(appointments.start)} AS "startAt",
                a.${identifier(appointments.end)} AS "endAt",
                a.${identifier(appointments.status)} AS "status",
                s.${identifier(services.name)} AS "serviceName",
                s.${identifier(services.price)} AS "price"
         FROM ${identifier(appointments.table)} a
         JOIN ${identifier(services.table)} s
           ON s.${identifier(services.id)} = a.${identifier(appointments.serviceId)}
         WHERE a.${identifier(appointments.clientId)} = $1
         ORDER BY a.${identifier(appointments.start)} DESC`,
        [clientId],
      )
      return result.rows
    },

    async createAppointment({ clientId, serviceId, startAt, endAt }, now = new Date()) {
      const client = await database.connect()
      try {
        await client.query('BEGIN')
        await client.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')

        const service = await this.findService(serviceId, client)
        if (!service) {
          const error = new Error('Serviço ativo não encontrado')
          error.code = 'SERVICE_NOT_FOUND'
          throw error
        }

        const config = await this.getScheduleConfig(client)
        const activeAppointments = await this.listAppointmentsForDate(startAt.slice(0, 10), client)
        const blocksForDate = await this.listBlocksForDate(startAt.slice(0, 10), client)

        const validation = validateAppointmentWindow({
          service,
          config,
          startAt,
          endAt,
          activeAppointments,
          blocks: blocksForDate,
          now,
        })
        if (!validation.valid) {
          const error = new Error(validation.message)
          error.code = validation.code
          throw error
        }

        const result = await client.query(
          `INSERT INTO ${identifier(appointments.table)}
             (${identifier(appointments.clientId)}, ${identifier(appointments.serviceId)},
              ${identifier(appointments.start)}, ${identifier(appointments.end)},
              ${identifier(appointments.status)})
           VALUES ($1, $2, $3, $4, $5)
           RETURNING ${identifier(appointments.id)} AS "id",
                     ${identifier(appointments.start)} AS "startAt",
                     ${identifier(appointments.end)} AS "endAt",
                     ${identifier(appointments.status)} AS "status"`,
          [clientId, serviceId, startAt, endAt, 'agendado'],
        )

        await client.query('COMMIT')
        return { ...result.rows[0], serviceId }
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    },

    async cancelAppointment(appointmentId, clientId, now = new Date()) {
      const client = await database.connect()
      try {
        await client.query('BEGIN')
        const result = await client.query(
          `SELECT a.${identifier(appointments.start)} AS "startAt",
                  a.${identifier(appointments.status)} AS "status",
                  c.${identifier(schedule.cancellationHours)} AS "cancellationHours"
           FROM ${identifier(appointments.table)} a
           CROSS JOIN ${identifier(schedule.table)} c
           WHERE a.${identifier(appointments.id)} = $1
             AND a.${identifier(appointments.clientId)} = $2
           FOR UPDATE`,
          [appointmentId, clientId],
        )
        const appointment = result.rows[0]
        if (!appointment) {
          const error = new Error('Agendamento não encontrado')
          error.code = 'APPOINTMENT_NOT_FOUND'
          throw error
        }

        const cancellation = validateCancellation({ appointment, now })
        if (!cancellation.valid) {
          const error = new Error(cancellation.message)
          error.code = cancellation.code
          throw error
        }

        const updated = await client.query(
          `UPDATE ${identifier(appointments.table)}
           SET ${identifier(appointments.status)} = $1
           WHERE ${identifier(appointments.id)} = $2
             AND ${identifier(appointments.clientId)} = $3
           RETURNING ${identifier(appointments.id)} AS "id",
                     ${identifier(appointments.status)} AS "status"`,
          ['cancelado', appointmentId, clientId],
        )
        await client.query('COMMIT')
        return updated.rows[0]
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    },
  }
}

export function validateAppointmentWindow({ service, config, startAt, endAt, activeAppointments, blocks, now }) {
  const start = new Date(startAt)
  const end = new Date(endAt)
  const duration = Number(service[services.duration])
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return { valid: false, code: 'INVALID_WINDOW', message: 'Horário inválido' }
  }
  if (Math.round((end - start) / 60000) !== duration) {
    return { valid: false, code: 'INVALID_DURATION', message: 'A duração não corresponde ao serviço' }
  }
  if (start <= now) {
    return { valid: false, code: 'PAST_WINDOW', message: 'O horário precisa estar no futuro' }
  }
  if (!isWithinBusinessHours(start, end, config)) {
    return { valid: false, code: 'OUTSIDE_SCHEDULE', message: 'Horário fora do expediente' }
  }
  if (blocks.some((item) => overlaps(start, end, item.startAt, item.endAt))) {
    return { valid: false, code: 'BLOCKED_WINDOW', message: 'Horário bloqueado' }
  }
  if (activeAppointments.some((item) => overlaps(start, end, item.startAt, item.endAt))) {
    return { valid: false, code: 'CONFLICT', message: 'Horário já ocupado' }
  }
  return { valid: true }
}

export function validateCancellation({ appointment, now }) {
  if (appointment.status !== 'agendado') {
    return { valid: false, code: 'CANNOT_CANCEL', message: 'Este agendamento não pode ser cancelado' }
  }
  const minimumHours = Number(appointment.cancellationHours)
  const startsAt = new Date(appointment.startAt)
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() - now.getTime() < minimumHours * 60 * 60 * 1000) {
    return { valid: false, code: 'CANCELLATION_DEADLINE', message: 'O prazo mínimo para cancelamento foi atingido' }
  }
  return { valid: true }
}

function overlaps(start, end, otherStart, otherEnd) {
  return start < new Date(otherEnd) && end > new Date(otherStart)
}

function isWithinBusinessHours(start, end, scheduleConfig) {
  if (!scheduleConfig) return false
  const day = start.getDay()
  const days = parseServiceDays(scheduleConfig.serviceDays)
  if (!days.includes(day)) return false
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()
  const opening = timeToMinutes(scheduleConfig.startTime)
  const closing = timeToMinutes(scheduleConfig.endTime)
  return startMinutes >= opening && endMinutes <= closing
}

function parseServiceDays(value) {
  if (Array.isArray(value)) return value.map(Number)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map(Number)
    } catch {
      return value.split(',').map((day) => Number(day.trim()))
    }
    return value.split(',').map((day) => Number(day.trim()))
  }
  return []
}

function timeToMinutes(value) {
  const [hours, minutes] = String(value).slice(0, 5).split(':').map(Number)
  return hours * 60 + minutes
}
