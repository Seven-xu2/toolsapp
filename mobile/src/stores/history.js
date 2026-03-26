import Vue from 'vue'
import { clearHistories, createHistory, deleteHistory, fetchHistories } from '../api/history.js'
import { useAuthStore } from './auth.js'

const state = Vue.observable ? Vue.observable({
  list: [],
  pageNum: 1,
  pageSize: 20,
  total: 0
}) : {
  list: [],
  pageNum: 1,
  pageSize: 20,
  total: 0
}

export function useHistoryStore() {
  const authStore = useAuthStore()

  async function load(pageNum) {
    const nextPage = pageNum || 1
    if (!authStore.isLoggedIn()) {
      state.list = []
      state.pageNum = 1
      state.total = 0
      return state
    }
    const data = await fetchHistories(nextPage, state.pageSize)
    state.list = data.list || []
    state.pageNum = data.pageNum
    state.pageSize = data.pageSize
    state.total = data.total
    return state
  }

  async function add(payload) {
    if (!authStore.isLoggedIn()) {
      return
    }
    await createHistory(payload)
  }

  async function remove(id) {
    await deleteHistory(id)
    await load(state.pageNum)
  }

  async function clear() {
    await clearHistories()
    await load(1)
  }

  return {
    state,
    load,
    add,
    remove,
    clear
  }
}
