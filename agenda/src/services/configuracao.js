import { request } from './api.js'

export function buscarConfiguracao() {
  return request('/admin/Configuracao')
}