<template>
  <view class="page auth-page">
    <view class="card">
      <text class="title">创建账号</text>
      <input v-model="form.phone" class="input" type="number" maxlength="11" placeholder="请输入手机号" />
      <input v-model="form.nickname" class="input" maxlength="20" placeholder="请输入昵称" />
      <input v-model="form.password" class="input" password placeholder="请输入密码" />
      <input v-model="form.confirmPassword" class="input" password placeholder="请再次输入密码" />
      <button class="primary-btn" @click="handleRegister">注册</button>
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
      form: {
        phone: '',
        nickname: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    async handleRegister() {
      if (!isPhone(this.form.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      if (!this.form.nickname) {
        uni.showToast({ title: '请输入昵称', icon: 'none' })
        return
      }
      if (!this.form.password || this.form.password.length < 6) {
        uni.showToast({ title: '密码至少 6 位', icon: 'none' })
        return
      }
      if (this.form.password !== this.form.confirmPassword) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' })
        return
      }
      await this.authStore.register({
        phone: this.form.phone,
        nickname: this.form.nickname,
        password: this.form.password
      })
      uni.showToast({ title: '注册成功', icon: 'none' })
      uni.navigateBack()
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
  margin-bottom: 40rpx;
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
</style>
