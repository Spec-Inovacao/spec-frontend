import { config } from './config.js'
import { pool } from './db.js'
import { createApp } from './app.js'

const app = createApp()
const server = app.listen(config.port, () => {
  console.log(`API de agendamento em http://localhost:${config.port}`)
})

function shutdown() {
  server.close(() => pool.end().finally(() => process.exit(0)))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
