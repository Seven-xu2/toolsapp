import { request } from '../utils/request.js'

export function fetchFavorites() {
  return request({ url: '/favorites', auth: true })
}

export function addFavorite(toolCode) {
  return request({ url: '/favorites', method: 'POST', data: { toolCode }, auth: true })
}

export function removeFavorite(toolCode) {
  return request({ url: `/favorites/${toolCode}`, method: 'DELETE', auth: true })
}
