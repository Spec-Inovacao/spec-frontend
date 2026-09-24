const developmentClientId = Number.parseInt(process.env.CLIENT_ID || '1', 10)

export const config = {
  port: Number.parseInt(process.env.PORT || '3001', 10),
  clientId: Number.isInteger(developmentClientId) ? developmentClientId : 1,
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL === 'true',
}

export const schema = {
  services: {
    table: 'PSERVICOS',
    id: process.env.DB_SERVICE_ID_COLUMN || 'IDSERVICO',
    name: process.env.DB_SERVICE_NAME_COLUMN || 'NOME',
    description: process.env.DB_SERVICE_DESCRIPTION_COLUMN || 'DESCRICAO',
    price: process.env.DB_SERVICE_PRICE_COLUMN || 'PRECO',
    duration: process.env.DB_SERVICE_DURATION_COLUMN || 'TEMPOMIN',
    active: process.env.DB_SERVICE_ACTIVE_COLUMN || 'ATIVO',
  },
  config: {
    table: 'PCONFIGEXP',
    start: process.env.DB_CONFIG_START_COLUMN || 'HORAINICIO',
    end: process.env.DB_CONFIG_END_COLUMN || 'HORAFIM',
    days: process.env.DB_CONFIG_DAYS_COLUMN || 'DIASATENDIMENTO',
    cancellationHours: process.env.DB_CONFIG_CANCEL_COLUMN || 'CANCELAMENTOMINHORA',
  },
  appointments: {
    table: 'PAGENDAMENTOS',
    id: process.env.DB_APPOINTMENT_ID_COLUMN || 'IDAGENDAMENTO',
    clientId: process.env.DB_APPOINTMENT_CLIENT_COLUMN || 'IDCLIENTE',
    serviceId: process.env.DB_APPOINTMENT_SERVICE_COLUMN || 'IDSERVICO',
    start: process.env.DB_APPOINTMENT_START_COLUMN || 'DATAHORA',
    end: process.env.DB_APPOINTMENT_END_COLUMN || 'DATAHORAFIM',
    status: process.env.DB_APPOINTMENT_STATUS_COLUMN || 'STATUS',
  },
  blocks: {
    table: 'PBLOQAGENDA',
    start: process.env.DB_BLOCK_START_COLUMN || 'DATAHORA',
    end: process.env.DB_BLOCK_END_COLUMN || 'DATAHORAFIM',
  },
}

const identifierPattern = /^[A-Z][A-Z0-9_]*$/i

export function identifier(value) {
  if (!identifierPattern.test(value)) {
    throw new Error(`Identificador SQL inválido: ${value}`)
  }

  return `"${value}"`
}
