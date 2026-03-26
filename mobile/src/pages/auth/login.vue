<template>
  <view class="page auth-page">
    <view class="card">
      <text class="title">欢迎回来</text>
      <text class="subtitle">可登录同步数据，也可先以游客身份使用本地工具</text>
      <input v-model="form.phone" class="input" type="number" maxlength="11" placeholder="请输入手机号" />
      <input v-model="form.password" class="input" password placeholder="请输入密码" />
      <button class="primary-btn" @click="handleLogin">登录</button>
      <button class="ghost-btn" @click="goRegister">注册账号</button>
      <button class="guest-btn" @click="enterGuestMode">游客进入</button>
    </view>
  </view>
</template>

<script>
import { useAuthStore } from '../../stores/auth.js'
import { isPhone } from '../../utils/validators.js'

export default {
  data() {
    return {
      authStore: useAuthStore(),
      allowGuestLogin: false,
      form: {
        phone: '',
        password: ''
      }
    }
  },
  onLoad(options) {
    this.allowGuestLogin = !!(options && options.forceLogin)
  },
  onShow() {
    if (this.authStore.isLoggedIn()) {
      uni.reLaunch({ url: '/src/pages/home/index' })
      return
    }
    if (this.authStore.isGuest() && !this.allowGuestLogin) {
      uni.reLaunch({ url: '/src/pages/home/index' })
    }
  },
  methods: {
    async handleLogin() {
      if (!isPhone(this.form.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      if (!this.form.password || this.form.password.length < 6) {
        uni.showToast({ title: '密码至少 6 位', icon: 'none' })
        return
      }
      await this.authStore.login({
        phone: this.form.phone,
        password: this.form.password
      })
      uni.showToast({ title: '登录成功', icon: 'none' })
      uni.reLaunch({ url: '/src/pages/home/index' })
    },
    goRegister() {
      uni.navigateTo({ url: '/src/pages/auth/register' })
    },
    enterGuestMode() {
      this.authStore.enterGuestMode()
      uni.showToast({ title: '已进入游客模式', icon: 'none' })
      uni.reLaunch({ url: '/src/pages/home/index' })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 48rpx;
  background: linear-gradient(180deg, #eef4ff, #f7f8fb);
}
.card {
  width: 100%;
  background: #fff;
  border-radius: 32rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(79, 124, 255, 0.12);
}
.title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
}
.subtitle {
  display: block;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 32rpx;
}
.input {
  width: 100%;
  height: 88rpx;
  background: #f5f7fb;
  border-radius: 18rpx;
  margin-bottom: 24rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
  margin-top: 12rpx;
}
.ghost-btn {
  margin-top: 20rpx;
  background: transparent;
  color: #4f7cff;
}
.guest-btn {
  margin-top: 20rpx;
  background: #eef2ff;
  color: #4f46e5;
}
</style>