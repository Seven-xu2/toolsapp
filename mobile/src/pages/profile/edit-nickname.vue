<template>
  <view class="page edit-page">
    <view v-if="blocked" class="login-card">
      <text class="login-title">修改昵称需要登录</text>
      <text class="login-text">游客模式下不能修改云端资料，请先登录。</text>
      <button class="primary-btn" @click="goLogin">去登录</button>
    </view>
    <view v-else class="card">
      <input v-model="nickname" class="input" maxlength="20" placeholder="请输入新昵称" />
      <button class="primary-btn" @click="save">保存</button>
    </view>
  </view>
</template>

<script>
import { useAuthStore } from '../../stores/auth.js'
import { updateProfile } from '../../api/user.js'

export default {
  data() {
    var authStore = useAuthStore()
    var user = authStore.state.user || {}
    return {
      authStore: authStore,
      nickname: user.nickname || '',
      blocked: false
    }
  },
  onShow() {
    this.blocked = !this.authStore.isLoggedIn()
  },
  methods: {
    async save() {
      if (!this.nickname) {
        uni.showToast({ title: '昵称不能为空', icon: 'none' })
        return
      }
      const data = await updateProfile({ nickname: this.nickname })
      this.authStore.state.user = data
      uni.setStorageSync('AUTH_USER', data)
      uni.showToast({ title: '修改成功', icon: 'none' })
      setTimeout(function () {
        uni.navigateBack()
      }, 500)
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
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
}
.login-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
}
.login-text {
  display: block;
  margin-top: 12rpx;
  color: #64748b;
  line-height: 1.7;
}
.input {
  height: 88rpx;
  background: #f5f7fb;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
  margin-top: 20rpx;
}
</style>