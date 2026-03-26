<template>
  <view class="page list-page">
    <view v-if="blocked" class="login-card">
      <text class="login-title">收藏功能需要登录</text>
      <text class="login-text">游客模式下不能使用云同步收藏，请先注册或登录。</text>
      <button class="primary-btn" @click="goLogin">去登录</button>
    </view>
    <template v-else>
      <view v-if="!items.length" class="empty">暂无收藏</view>
      <view v-for="item in items" :key="item.id" class="list-card" @click="openTool(item.toolCode)">
        <view>
          <text class="name">{{ item.icon }} {{ item.toolName }}</text>
          <text class="desc">{{ item.description }}</text>
        </view>
        <button size="mini" class="danger-btn" @click.stop="cancelFavorite(item.toolCode)">取消</button>
      </view>
    </template>
  </view>
</template>

<script>
import { fetchFavorites, removeFavorite } from '../../api/favorite.js'
import { useAuthStore } from '../../stores/auth.js'
import { getLocalToolMap } from '../../config/toolCatalog.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      items: [],
      blocked: false
    }
  },
  onShow() {
    if (!this.authStore.isLoggedIn()) {
      this.blocked = true
      this.items = []
      return
    }
    this.blocked = false
    this.loadData()
  },
  methods: {
    async loadData() {
      this.items = await fetchFavorites()
    },
    async cancelFavorite(toolCode) {
      await removeFavorite(toolCode)
      uni.showToast({ title: '已取消收藏', icon: 'none' })
      await this.loadData()
    },
    openTool(toolCode) {
      var tool = getLocalToolMap()[toolCode]
      if (tool && tool.route) {
        uni.navigateTo({ url: tool.route })
      }
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
  color: #6b7280;
  line-height: 1.7;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
  margin-top: 20rpx;
}
.list-card {
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.danger-btn {
  background: #fff1f2;
  color: #e11d48;
}
.empty {
  padding: 80rpx 0;
  text-align: center;
  color: #94a3b8;
}
</style>