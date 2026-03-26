import { getEnvConfig } from '../config/env.js'
import { useAuthStore } from '../stores/auth.js'

export function request(options) {
  const authStore = useAuthStore()
  const { baseUrl } = getEnvConfig()
  const url = options.url
  const method = options.method || 'GET'
  const data = options.data
  const auth = !!options.auth
  const silent = !!options.silent

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: auth && authStore.state.token
        ? { Authorization: `Bearer ${authStore.state.token}` }
        : {},
      success: (response) => {
        const body = response.data || {}

        if (response.statusCode === 401) {
          authStore.logout(false)
          if (!silent) {
            uni.showToast({ title: body.message || '登录状态已失效', icon: 'none' })
          }
          if (getCurrentPages().length > 0) {
            uni.reLaunch({ url: '/src/pages/auth/login' })
          }
          reject(body)
          return
        }

        if (response.statusCode >= 200 && response.statusCode < 300 && body.code === 0) {
          resolve(body.data)
          return
        }

        if (!silent) {
          uni.showToast({ title: body.message || '请求失败', icon: 'none' })
        }
        reject(body)
      },
      fail: (error) => {
        if (!silent) {
          uni.showToast({ title: '网络异常', icon: 'none' })
        }
        reject(error)
      }
    })
  })
}