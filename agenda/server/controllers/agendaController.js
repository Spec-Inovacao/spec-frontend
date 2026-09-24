function sendError(response, error) {
  const statusByCode = {
    INVALID_DATE: 400,
    INVALID_WINDOW: 400,
    INVALID_DURATION: 409,
    PAST_WINDOW: 409,
    OUTSIDE_SCHEDULE: 409,
    BLOCKED_WINDOW: 409,
    CONFLICT: 409,
    SERVICE_NOT_FOUND: 404,
    APPOINTMENT_NOT_FOUND: 404,
    CANNOT_CANCEL: 409,
    CANCELLATION_DEADLINE: 409,
  }
  const status = statusByCode[error.code] || (error.code === 'ECONNREFUSED' ? 503 : 500)
  if (status === 500) console.error(error)
  const message = error.code === 'ECONNREFUSED'
    ? 'A agenda está temporariamente indisponível.'
    : error.message || 'Erro interno'
  return response.status(status).json({ error: message })
}

export function createAgendaController(service) {
  return {
    listServices: async (_request, response) => {
      try {
        response.json({ services: await service.listServices() })
      } catch (error) {
        sendError(response, error)
      }
    },

    getAvailability: async (request, response) => {
      try {
        const { date, serviceId } = request.query
        if (!date || !serviceId) return response.status(400).json({ error: 'date e serviceId são obrigatórios' })
        response.json(await service.getAvailability(date, serviceId))
      } catch (error) {
        sendError(response, error)
      }
    },

    createAppointment: async (request, response) => {
      try {
        const { serviceId, startAt, endAt } = request.body
        if (!serviceId || !startAt || !endAt) return response.status(400).json({ error: 'serviceId, startAt e endAt são obrigatórios' })
        response.status(201).json({ appointment: await service.createAppointment({ serviceId: Number(serviceId), startAt, endAt }) })
      } catch (error) {
        sendError(response, error)
      }
    },

    listAppointments: async (_request, response) => {
      try {
        response.json({ appointments: await service.listAppointments() })
      } catch (error) {
        sendError(response, error)
      }
    },

    cancelAppointment: async (request, response) => {
      try {
        response.json({ appointment: await service.cancelAppointment(request.params.id) })
      } catch (error) {
        sendError(response, error)
      }
    },
  }
}
