import { request } from '../utils/request.js'

export function register(data) {
  return request({ url: '/auth/register', method: 'POST', data })
}

export function login(data) {
  return request({ url: '/auth/login', method: 'POST', data })
}
