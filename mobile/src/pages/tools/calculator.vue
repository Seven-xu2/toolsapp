<template>
  <view class="page calculator-page">
    <view class="display-card">
      <view class="display-meta">
        <text class="display-label">计算器</text>
        <text class="display-hint">支持括号与小数运算</text>
      </view>
      <text class="expression">{{ expression || '0' }}</text>
      <text class="result">{{ result }}</text>
    </view>
    <view class="keyboard">
      <button
        v-for="item in buttons"
        :key="item.label"
        :class="['key', item.className]"
        @click="press(item.value)"
      >
        {{ item.label }}
      </button>
    </view>
  </view>
</template>

<script>
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

const BUTTONS = [
  { label: 'C', value: 'C', className: 'key-soft' },
  { label: '(', value: '(', className: 'key-soft' },
  { label: ')', value: ')', className: 'key-soft' },
  { label: '÷', value: '/', className: 'key-operator' },
  { label: '7', value: '7', className: 'key-number' },
  { label: '8', value: '8', className: 'key-number' },
  { label: '9', value: '9', className: 'key-number' },
  { label: '×', value: '*', className: 'key-operator' },
  { label: '4', value: '4', className: 'key-number' },
  { label: '5', value: '5', className: 'key-number' },
  { label: '6', value: '6', className: 'key-number' },
  { label: '-', value: '-', className: 'key-operator' },
  { label: '1', value: '1', className: 'key-number' },
  { label: '2', value: '2', className: 'key-number' },
  { label: '3', value: '3', className: 'key-number' },
  { label: '+', value: '+', className: 'key-operator' },
  { label: '0', value: '0', className: 'key-number' },
  { label: '.', value: '.', className: 'key-number' },
  { label: '⌫', value: '⌫', className: 'key-soft' },
  { label: '=', value: '=', className: 'key-equals' }
]

export default {
  data() {
    return {
      expression: '',
      result: '0',
      buttons: BUTTONS
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
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 55%, #334155 100%);
  color: #fff;
  border-radius: 36rpx;
  padding: 32rpx;
  min-height: 260rpx;
  box-shadow: 0 24rpx 56rpx rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.display-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.display-label {
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.display-hint {
  font-size: 22rpx;
  color: rgba(226, 232, 240, 0.76);
}

.expression {
  text-align: right;
  min-height: 52rpx;
  color: rgba(226, 232, 240, 0.72);
  font-size: 32rpx;
  word-break: break-all;
}

.result {
  text-align: right;
  font-size: 64rpx;
  font-weight: 700;
  margin-top: 20rpx;
  line-height: 1.2;
  word-break: break-all;
}

.keyboard {
  margin-top: 28rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18rpx;
}

.key {
  height: 104rpx;
  border-radius: 28rpx;
  border: none;
  font-size: 34rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 28rpx rgba(148, 163, 184, 0.18);
}

.key::after {
  border: none;
}

.key-number {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #0f172a;
}

.key-soft {
  background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #334155;
}

.key-operator {
  background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.key-equals {
  background: linear-gradient(180deg, #4f7cff 0%, #355df5 100%);
  color: #fff;
  box-shadow: 0 18rpx 30rpx rgba(79, 124, 255, 0.28);
}

</style>
