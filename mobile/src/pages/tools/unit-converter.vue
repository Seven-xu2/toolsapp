<template>
  <view class="page converter-page">
    <view class="card">
      <picker :range="categoryLabels" :value="categoryIndex" @change="changeCategory">
        <view class="picker">分类：{{ categoryLabels[categoryIndex] }}</view>
      </picker>
      <input v-model="value" class="input" type="digit" placeholder="请输入数值" />
      <view class="row">
        <picker :range="availableUnits" :value="fromIndex" @change="changeFrom">
          <view class="picker">从：{{ availableUnits[fromIndex] }}</view>
        </picker>
        <picker :range="availableUnits" :value="toIndex" @change="changeTo">
          <view class="picker">到：{{ availableUnits[toIndex] }}</view>
        </picker>
      </view>
      <button class="primary-btn" @click="convert">开始转换</button>
      <view class="result-box">
        <text class="result-label">结果</text>
        <text class="result-value">{{ result || '--' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'
import { convertUnit, unitOptions } from '../../utils/unitConverter.js'

const categories = [
  { key: 'length', label: '长度' },
  { key: 'weight', label: '重量' },
  { key: 'temperature', label: '温度' },
  { key: 'area', label: '面积' },
  { key: 'volume', label: '体积' }
]

export default {
  data() {
    return {
      categories: categories,
      categoryLabels: categories.map(function (item) { return item.label }),
      categoryIndex: 0,
      fromIndex: 0,
      toIndex: 1,
      value: '',
      result: ''
    }
  },
  computed: {
    availableUnits() {
      return unitOptions[this.categories[this.categoryIndex].key]
    }
  },
  methods: {
    changeCategory(event) {
      this.categoryIndex = Number(event.detail.value)
      this.fromIndex = 0
      this.toIndex = Math.min(1, this.availableUnits.length - 1)
      this.result = ''
    },
    changeFrom(event) {
      this.fromIndex = Number(event.detail.value)
    },
    changeTo(event) {
      this.toIndex = Number(event.detail.value)
    },
    async convert() {
      var category = this.categories[this.categoryIndex]
      var fromUnit = this.availableUnits[this.fromIndex]
      var toUnit = this.availableUnits[this.toIndex]
      this.result = convertUnit(category.key, this.value, fromUnit, toUnit)
      if (!this.result) {
        uni.showToast({ title: '请输入有效数值', icon: 'none' })
        return
      }
      await recordHistoryIfLoggedIn({
        toolCode: 'unit-converter',
        toolName: '单位转换',
        summary: category.label + '：' + this.value + ' ' + fromUnit + ' -> ' + this.result + ' ' + toUnit
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
  border-radius: 24rpx;
  padding: 28rpx;
}
.input,
.picker {
  height: 88rpx;
  line-height: 88rpx;
  background: #f5f7fb;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
}
.result-box {
  margin-top: 24rpx;
  background: #f8fafc;
  border-radius: 20rpx;
  padding: 24rpx;
}
.result-label {
  display: block;
  color: #6b7280;
}
.result-value {
  display: block;
  margin-top: 16rpx;
  font-size: 38rpx;
  font-weight: 700;
}
</style>
