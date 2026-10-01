const CLIENT_STORAGE_KEY = 'agenda-facil-cliente'

export function getSavedClient() {
  try {
    const client = JSON.parse(localStorage.getItem(CLIENT_STORAGE_KEY) || 'null')
    return client?.id != null ? client : null
  } catch {
    return null
  }
}

export function saveClient(client) {
  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(client))
  } catch {
    return false
  }
  return true
}