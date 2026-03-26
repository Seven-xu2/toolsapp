import Vue from 'vue'
import { fetchTools, fetchFavoriteCodes } from '../api/tool.js'
import { addFavorite, removeFavorite } from '../api/favorite.js'
import { useAuthStore } from './auth.js'
import { getLocalToolCatalog, getLocalToolMap } from '../config/toolCatalog.js'

const state = Vue.observable ? Vue.observable({
  tools: [],
  favoriteCodes: [],
  usingLocalCatalog: false
}) : {
  tools: [],
  favoriteCodes: [],
  usingLocalCatalog: false
}

function normalizeTools(list) {
  var localMap = getLocalToolMap()
  return (list || []).map(function (item) {
    var local = localMap[item.code] || {}
    return Object.assign({}, local, item, {
      requiresBackend: typeof item.requiresBackend === 'boolean'
        ? item.requiresBackend
        : !!local.requiresBackend,
      route: item.route || local.route || ''
    })
  })
}

export function useToolStore() {
  const authStore = useAuthStore()

  async function loadTools() {
    if (!authStore.isLoggedIn()) {
      state.tools = getLocalToolCatalog()
      state.usingLocalCatalog = true
      return state.tools
    }

    try {
      var remoteTools = await fetchTools({ silent: true })
      state.tools = normalizeTools(remoteTools)
      state.usingLocalCatalog = false
    } catch (error) {
      state.tools = getLocalToolCatalog()
      state.usingLocalCatalog = true
    }
    return state.tools
  }

  async function loadFavoriteCodes() {
    if (!authStore.isLoggedIn()) {
      state.favoriteCodes = []
      return []
    }
    const codes = await fetchFavoriteCodes()
    state.favoriteCodes = Array.isArray(codes) ? codes.slice() : []
    return state.favoriteCodes
  }

  async function toggleFavorite(toolCode) {
    if (!authStore.isLoggedIn()) {
      uni.showToast({ title: '请先登录后再收藏', icon: 'none' })
      return false
    }
    if (state.favoriteCodes.indexOf(toolCode) !== -1) {
      await removeFavorite(toolCode)
      state.favoriteCodes = state.favoriteCodes.filter(function (item) {
        return item !== toolCode
      })
      return true
    }
    await addFavorite(toolCode)
    state.favoriteCodes = state.favoriteCodes.concat(toolCode)
    return true
  }

  function getToolByCode(toolCode) {
    return state.tools.find(function (item) {
      return item.code === toolCode
    })
  }

  return {
    state,
    loadTools,
    loadFavoriteCodes,
    toggleFavorite,
    getToolByCode,
    isFavorite: function (toolCode) {
      return state.favoriteCodes.indexOf(toolCode) !== -1
    }
  }
}