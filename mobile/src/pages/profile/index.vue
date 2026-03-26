<template>
  <view class="page profile-page">
    <view v-if="blocked" class="login-card">
      <text class="login-title">个人中心需要登录</text>
      <text class="login-text">游客模式下可以使用本地工具，但个人资料、收藏和历史需要注册/登录后才能使用。</text>
      <button class="primary-btn" @click="goLogin">去登录</button>
    </view>
    <template v-else>
      <view class="profile-card">
        <view class="avatar">U</view>
        <text class="nickname">{{ displayNickname }}</text>
        <text class="phone">{{ maskedPhone }}</text>
      </view>

      <view class="stats">
        <view class="stat-item">
          <text class="stat-value">{{ stats.favoriteCount }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.historyCount }}</text>
          <text class="stat-label">历史</text>
        </view>
      </view>

      <view class="menu-card">
        <view class="menu-item" @click="goEditNickname">修改昵称</view>
        <view class="menu-item" @click="goFavorites">我的收藏</view>
        <view class="menu-item" @click="goHistory">使用历史</view>
        <view class="menu-item">版本 1.0.0</view>
      </view>

      <button class="primary-btn logout-btn" @click="logout">退出登录</button>
    </template>
  </view>
</template>

<script>
import { fetchStats } from '../../api/user.js'
import { useAuthStore } from '../../stores/auth.js'
import { maskPhone } from '../../utils/validators.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      stats: {
        favoriteCount: 0,
        historyCount: 0
      },
      blocked: false
    }
  },
  computed: {
    displayNickname() {
      var user = this.authStore.state.user
      return (user && user.nickname) || '游客'
    },
    maskedPhone() {
      var user = this.authStore.state.user
      return maskPhone((user && user.phone) || '')
    }
  },
  async onShow() {
    if (!this.authStore.isLoggedIn()) {
      this.blocked = true
      return
    }
    this.blocked = false
    await this.authStore.fetchProfile()
    this.stats = await fetchStats()
  },
  methods: {
    goEditNickname() {
      uni.navigateTo({ url: '/src/pages/profile/edit-nickname' })
    },
    goFavorites() {
      uni.navigateTo({ url: '/src/pages/favorites/index' })
    },
    goHistory() {
      uni.navigateTo({ url: '/src/pages/history/index' })
    },
    logout() {
      this.authStore.logout()
      uni.reLaunch({ url: '/src/pages/auth/login' })
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
.profile-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 32rpx;
}
.login-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
}
.login-text {
  display: block;
  margin-top: 12rpx;
  color: #64748b;
  line-height: 1.7;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
  margin-top: 24rpx;
}
.profile-card {
  background: linear-gradient(135deg, #4f7cff, #6d8fff);
  color: #fff;
  text-align: center;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto 20rpx;
  border-radius: 60rpx;
  background: rgba(255, 255, 255, 0.18);
  line-height: 120rpx;
  font-size: 48rpx;
}
.nickname {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
}
.phone {
  display: block;
  margin-top: 12rpx;
}
.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin: 24rpx 0;
}
.stat-item,
.menu-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
}
.stat-item {
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
}
.stat-label {
  display: block;
  margin-top: 10rpx;
  color: #6b7280;
}
.menu-item {
  padding: 22rpx 0;
  border-bottom: 1px solid #eef2f7;
}
.menu-item:last-child {
  border-bottom: none;
}
.logout-btn {
  background: #111827;
}
</style>