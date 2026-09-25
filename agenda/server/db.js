import pg from 'pg'
import { config } from './config.js'

const { Pool } = pg

export function createPool(overrides = {}) {
  return new Pool({
    connectionString: overrides.databaseUrl ?? config.databaseUrl,
    ssl: overrides.databaseSsl ?? (config.databaseSsl ? { rejectUnauthorized: false } : undefined),
    max: overrides.max ?? 10,
  })
}

export const pool = createPool()
