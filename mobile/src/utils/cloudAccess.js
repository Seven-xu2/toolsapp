import { useAuthStore } from '../stores/auth.js'

export function promptLoginRequired(featureName) {
  var name = featureName || '该功能'
  uni.showModal({
    title: '需要登录',
    content: name + ' 需要注册/登录后才能使用。',
    confirmText: '去登录',
    cancelText: '稍后再说',
    success: function (res) {
      if (res.confirm) {
        uni.navigateTo({ url: '/src/pages/auth/login?forceLogin=1' })
      }
    }
  })
}

export function ensureCloudAccess(featureName) {
  var authStore = useAuthStore()
  if (authStore.isLoggedIn()) {
    return true
  }
  promptLoginRequired(featureName)
  return false
}