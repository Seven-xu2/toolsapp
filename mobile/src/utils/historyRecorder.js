import { useAuthStore } from '../stores/auth.js'
import { useHistoryStore } from '../stores/history.js'

export async function recordHistoryIfLoggedIn(payload) {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn()) {
    return
  }
  const historyStore = useHistoryStore()
  await historyStore.add(payload)
}
