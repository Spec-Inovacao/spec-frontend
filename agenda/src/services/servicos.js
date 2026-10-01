import { request } from './api.js'

export async function listarServicos() {
  const payload = await request('/Servicos')
  return Array.isArray(payload) ? payload : payload?.items || payload?.data || []
}