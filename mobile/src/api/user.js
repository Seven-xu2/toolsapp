import { request } from '../utils/request.js'

export function fetchProfile() {
  return request({ url: '/users/me', auth: true })
}

export function updateProfile(data) {
  return request({ url: '/users/me', method: 'PUT', data, auth: true })
}

export function fetchStats() {
  return request({ url: '/users/me/stats', auth: true })
}
