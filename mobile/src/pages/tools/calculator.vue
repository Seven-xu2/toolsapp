<template>
  <view class="page calculator-page">
    <view class="display-card">
      <text class="expression">{{ expression || '0' }}</text>
      <text class="result">{{ result }}</text>
    </view>
    <view class="keyboard">
      <button v-for="item in buttons" :key="item" class="key" @click="press(item)">{{ item }}</button>
    </view>
  </view>
</template>

<script>
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

export default {
  data() {
    return {
      expression: '',
      result: '0',
      buttons: ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '⌫', '+', 'C', '(', ')', '=']
    }
  },
  methods: {
    async press(value) {
      if (value === 'C') {
        this.expression = ''
        this.result = '0'
        return
      }
      if (value === '⌫') {
        this.expression = this.expression.slice(0, -1)
        return
      }
      if (value === '=') {
        try {
          var safeExpression = this.expression.replace(/[^0-9+\-*/().]/g, '')
          var output = String(Function('return (' + (safeExpression || 0) + ')')())
          this.result = output
          await recordHistoryIfLoggedIn({
            toolCode: 'calculator',
            toolName: '计算器',
            summary: this.expression + ' = ' + output
          })
          this.expression = output
        } catch (error) {
          uni.showToast({ title: '表达式错误', icon: 'none' })
        }
        return
      }
      this.expression += value
    }
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}
.display-card {
  background: #111827;
  color: #fff;
  border-radius: 28rpx;
  padding: 32rpx;
  min-height: 220rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.expression {
  text-align: right;
  color: #9ca3af;
}
.result {
  text-align: right;
  font-size: 60rpx;
  font-weight: 700;
  margin-top: 20rpx;
}
.keyboard {
  margin-top: 24rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}
.key {
  background: #fff;
  color: #111827;
  height: 96rpx;
}
</style>
