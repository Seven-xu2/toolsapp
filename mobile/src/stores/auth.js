import Vue from 'vue'
import { fetchProfile } from '../api/user.js'
import { login, register } from '../api/auth.js'

const state = Vue.observable ? Vue.observable({
  token: uni.getStorageSync('AUTH_TOKEN') || '',
  user: uni.getStorageSync('AUTH_USER') || null,
  guestMode: !!uni.getStorageSync('AUTH_GUEST_MODE')
}) : {
  token: uni.getStorageSync('AUTH_TOKEN') || '',
  user: uni.getStorageSync('AUTH_USER') || null,
  guestMode: !!uni.getStorageSync('AUTH_GUEST_MODE')
}

if (state.guestMode && !state.user) {
  state.user = { nickname: '游客' }
}

function persist() {
  uni.setStorageSync('AUTH_TOKEN', state.token || '')
  uni.setStorageSync('AUTH_USER', state.user || null)
  uni.setStorageSync('AUTH_GUEST_MODE', state.guestMode ? '1' : '')
}

function clearGuestState() {
  state.guestMode = false
}

export function useAuthStore() {
  async function loginAction(payload) {
    const data = await login(payload)
    state.token = data.token
    state.user = data.user
    clearGuestState()
    persist()
    await fetchProfileAction()
    return data
  }

  function registerAction(payload) {
    return register(payload)
  }

  async function fetchProfileAction() {
    if (!state.token) {
      return null
    }
    state.user = await fetchProfile()
    persist()
    return state.user
  }

  function enterGuestMode() {
    state.token = ''
    state.user = { nickname: '游客' }
    state.guestMode = true
    persist()
  }

  function logout(showToast) {
    state.token = ''
    state.user = null
    state.guestMode = false
    persist()
    if (showToast !== false) {
      uni.showToast({ title: '已退出登录', icon: 'none' })
    }
  }

  return {
    state,
    login: loginAction,
    register: registerAction,
    fetchProfile: fetchProfileAction,
    enterGuestMode,
    logout,
    isLoggedIn: function () {
      return !!state.token
    },
    isGuest: function () {
      return !state.token && !!state.guestMode
    }
  }
}