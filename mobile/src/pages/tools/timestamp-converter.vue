<template>
  <view class="page time-page">
    <view class="card">
      <switch :checked="isMillis" @change="toggleMode" />
      <text class="switch-label">{{ isMillis ? '毫秒' : '秒' }}</text>
      <input v-model="timestampValue" class="input" type="number" placeholder="请输入时间戳" />
      <button class="primary-btn" @click="convertTimestamp">时间戳转日期</button>
      <text class="result">{{ dateResult || '--' }}</text>
      <input v-model="dateValue" class="input" placeholder="请输入日期，例如 2026-03-25 14:30:00" />
      <button class="ghost-btn" @click="convertDate">日期转时间戳</button>
      <text class="result">{{ timestampResult || '--' }}</text>
    </view>
  </view>
</template>

<script>
import { timestampToText, textToTimestamp } from '../../utils/timestamp.js'
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

export default {
  data() {
    return {
      isMillis: false,
      timestampValue: '',
      dateValue: '',
      dateResult: '',
      timestampResult: ''
    }
  },
  methods: {
    toggleMode(event) {
      this.isMillis = !!event.detail.value
    },
    async convertTimestamp() {
      this.dateResult = timestampToText(this.timestampValue, this.isMillis)
      if (!this.dateResult) {
        uni.showToast({ title: '时间戳无效', icon: 'none' })
        return
      }
      await recordHistoryIfLoggedIn({
        toolCode: 'timestamp-converter',
        toolName: '时间戳转换',
        summary: this.timestampValue + ' -> ' + this.dateResult
      })
    },
    async convertDate() {
      this.timestampResult = textToTimestamp(this.dateValue, this.isMillis)
      if (!this.timestampResult) {
        uni.showToast({ title: '日期无效', icon: 'none' })
        return
      }
      await recordHistoryIfLoggedIn({
        toolCode: 'timestamp-converter',
        toolName: '时间戳转换',
        summary: this.dateValue + ' -> ' + this.timestampResult
      })
    }
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}
.card {
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx;
}
.switch-label {
  margin-left: 16rpx;
  vertical-align: middle;
}
.input {
  height: 88rpx;
  background: #f5f7fb;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-top: 20rpx;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
  margin-top: 20rpx;
}
.ghost-btn {
  background: #eef2ff;
  color: #4f46e5;
  margin-top: 20rpx;
}
.result {
  display: block;
  margin-top: 14rpx;
  color: #334155;
  line-height: 1.7;
}
</style>
