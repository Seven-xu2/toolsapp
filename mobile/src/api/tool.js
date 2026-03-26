import { request } from '../utils/request.js'

export function fetchTools(options) {
  return request({ url: '/tools', silent: options && options.silent })
}

export function fetchFavoriteCodes() {
  return request({ url: '/tools/favorites', auth: true })
}