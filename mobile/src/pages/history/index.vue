<template>
  <view class="page list-page">
    <view v-if="blocked" class="login-card">
      <text class="login-title">历史记录需要登录</text>
      <text class="login-text">游客模式下不能使用云同步历史，请先注册或登录。</text>
      <button class="primary-btn" @click="goLogin">去登录</button>
    </view>
    <template v-else>
      <view class="actions">
        <button size="mini" class="ghost-btn" @click="refresh">刷新</button>
        <button size="mini" class="danger-btn" @click="clearAll">清空</button>
      </view>
      <view v-if="!historyStore.state.list.length" class="empty">暂无历史</view>
      <view v-for="item in historyStore.state.list" :key="item.id" class="list-card">
        <view>
          <text class="name">{{ item.toolName }}</text>
          <text class="desc">{{ item.summary }}</text>
          <text class="time">{{ item.createdAt }}</text>
        </view>
        <button size="mini" class="danger-btn" @click="removeOne(item.id)">删除</button>
      </view>
    </template>
  </view>
</template>

<script>
import { useHistoryStore } from '../../stores/history.js'
import { useAuthStore } from '../../stores/auth.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      historyStore: useHistoryStore(),
      blocked: false
    }
  },
  onShow() {
    if (!this.authStore.isLoggedIn()) {
      this.blocked = true
      return
    }
    this.blocked = false
    this.refresh()
  },
  methods: {
    async refresh() {
      await this.historyStore.load(1)
    },
    async removeOne(id) {
      await this.historyStore.remove(id)
    },
    async clearAll() {
      await this.historyStore.clear()
      uni.showToast({ title: '已清空', icon: 'none' })
    },
    goLogin() {
      uni.navigateTo({ url: '/src/pages/auth/login' })
    }
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}
.login-card,
.list-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
}
.login-title,
.name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
}
.login-text,
.desc {
  display: block;
  margin-top: 10rpx;
  color: #475569;
  line-height: 1.7;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
  margin-top: 20rpx;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.list-card {
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time {
  display: block;
  margin-top: 10rpx;
  color: #94a3b8;
  font-size: 24rpx;
}
.danger-btn {
  background: #fff1f2;
  color: #e11d48;
}
.ghost-btn {
  background: #eef2ff;
  color: #4f46e5;
}
.empty {
  padding: 80rpx 0;
  text-align: center;
  color: #94a3b8;
}
</style>