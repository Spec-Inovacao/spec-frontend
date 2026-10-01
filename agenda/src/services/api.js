const configuredBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const apiBaseUrl = configuredBaseUrl.endsWith('/api')
  ? configuredBaseUrl
  : `${configuredBaseUrl}/api`

export async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const validation = payload?.errors && typeof payload.errors === 'object'
      ? Object.values(payload.errors).flat().filter(Boolean).join(' ')
      : ''
    throw new Error(payload?.message || payload?.error || payload?.title || validation || 'Não foi possível concluir a operação')
  }
  return payload
}
