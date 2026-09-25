import { Router } from 'express'

export function createAgendaRoutes(controller) {
  const router = Router()
  router.get('/services', controller.listServices)
  router.get('/availability', controller.getAvailability)
  router.get('/appointments', controller.listAppointments)
  router.post('/appointments', controller.createAppointment)
  router.post('/appointments/:id/cancel', controller.cancelAppointment)
  return router
}
