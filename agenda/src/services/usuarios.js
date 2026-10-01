import { request } from './api.js'

export function criarUsuario(usuario) {
  return request('/Usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario),
  })
}