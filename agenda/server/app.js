import express from 'express'
import { config } from './config.js'
import { pool } from './db.js'
import { createAgendaController } from './controllers/agendaController.js'
import { createAgendaRepository } from './repositories/agendaRepository.js'
import { createAgendaRoutes } from './routes/agendaRoutes.js'
import { createAgendaService } from './services/agendaService.js'

export function createApp({ database = pool, repository: providedRepository, clientId = config.clientId, now } = {}) {
  const repository = providedRepository ?? createAgendaRepository(database)
  const service = createAgendaService(repository, { clientId, now })
  const controller = createAgendaController(service)
  const app = express()

  app.use(express.json())
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
  app.use('/api', createAgendaRoutes(controller))
  app.use((_request, response) => response.status(404).json({ error: 'Rota não encontrada' }))
  return app
}
