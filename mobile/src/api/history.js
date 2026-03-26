import { request } from '../utils/request.js'

export function fetchHistories(pageNum = 1, pageSize = 20) {
  return request({ url: `/histories?pageNum=${pageNum}&pageSize=${pageSize}`, auth: true })
}

export function createHistory(data) {
  return request({ url: '/histories', method: 'POST', data, auth: true })
}

export function deleteHistory(id) {
  return request({ url: `/histories/${id}`, method: 'DELETE', auth: true })
}

export function clearHistories() {
  return request({ url: '/histories', method: 'DELETE', auth: true })
}
