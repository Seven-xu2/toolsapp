<template>
  <view class="page text-tool-page">
    <view class="card">
      <textarea v-model="sourceText" class="textarea" maxlength="2000" placeholder="请输入文本" />
      <view class="actions">
        <button size="mini" class="ghost-btn" @click="apply('trim')">去首尾空格</button>
        <button size="mini" class="ghost-btn" @click="apply('upper')">转大写</button>
        <button size="mini" class="ghost-btn" @click="apply('lower')">转小写</button>
        <button size="mini" class="ghost-btn" @click="apply('linesToComma')">换行转逗号</button>
        <button size="mini" class="ghost-btn" @click="apply('commaToLines')">逗号转换行</button>
        <button size="mini" class="ghost-btn" @click="apply('count')">字符统计</button>
      </view>
      <view class="result-box">
        <text class="result-title">结果</text>
        <text class="result-text">{{ resultText || '--' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { commaToLines, countChars, linesToComma, toLower, toUpper, trimText } from '../../utils/textTools.js'
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

const handlers = {
  trim: { label: '去首尾空格', run: trimText },
  upper: { label: '转大写', run: toUpper },
  lower: { label: '转小写', run: toLower },
  linesToComma: { label: '换行转逗号', run: linesToComma },
  commaToLines: { label: '逗号转换行', run: commaToLines },
  count: { label: '字符统计', run: countChars }
}

export default {
  data() {
    return {
      sourceText: '',
      resultText: ''
    }
  },
  methods: {
    async apply(type) {
      var handler = handlers[type]
      this.resultText = handler.run(this.sourceText)
      await recordHistoryIfLoggedIn({
        toolCode: 'text-tools',
        toolName: '文本工具',
        summary: handler.label + '，文本长度 ' + this.sourceText.length
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
.textarea {
  width: 100%;
  min-height: 240rpx;
  background: #f5f7fb;
  border-radius: 18rpx;
  padding: 24rpx;
  box-sizing: border-box;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;
}
.ghost-btn {
  background: #eef2ff;
  color: #4f46e5;
}
.result-box {
  margin-top: 24rpx;
  background: #f8fafc;
  border-radius: 20rpx;
  padding: 24rpx;
}
.result-title {
  display: block;
  font-weight: 700;
}
.result-text {
  display: block;
  margin-top: 16rpx;
  white-space: pre-wrap;
  line-height: 1.7;
}
</style>
