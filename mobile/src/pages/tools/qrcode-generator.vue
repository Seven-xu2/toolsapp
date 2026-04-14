<template>
  <view class="page qrcode-page">
    <view class="card">
      <view class="section-header">
        <text class="section-title">二维码内容</text>
        <text class="section-tip">已支持多种类型内容编码</text>
      </view>

      <view class="type-grid">
        <view
          v-for="item in qrTypes"
          :key="item.value"
          :class="['type-chip', activeType === item.value ? 'type-chip-active' : '']"
          @click="switchType(item.value)"
        >
          <text :class="['type-chip-text', activeType === item.value ? 'type-chip-text-active' : '']">{{ item.label }}</text>
        </view>
      </view>

      <view class="form-panel">
        <template v-if="activeType === 'text'">
          <textarea v-model="form.content.text" class="textarea" maxlength="300" placeholder="请输入普通文本内容" />
        </template>
        <template v-else-if="activeType === 'url'">
          <input v-model="form.content.url" class="input" maxlength="300" placeholder="请输入 https:// 开头的链接" />
        </template>
        <template v-else-if="activeType === 'phone'">
          <input v-model="form.content.phone" class="input" maxlength="32" placeholder="请输入电话号码" />
        </template>
        <template v-else-if="activeType === 'sms'">
          <input v-model="form.content.phone" class="input" maxlength="32" placeholder="请输入短信号码" />
          <textarea v-model="form.content.message" class="textarea textarea-compact" maxlength="200" placeholder="请输入短信内容" />
        </template>
        <template v-else-if="activeType === 'email'">
          <input v-model="form.content.email" class="input" maxlength="120" placeholder="请输入邮箱地址" />
          <input v-model="form.content.subject" class="input" maxlength="120" placeholder="请输入邮件主题" />
          <textarea v-model="form.content.body" class="textarea textarea-compact" maxlength="300" placeholder="请输入邮件正文" />
        </template>
        <template v-else-if="activeType === 'wifi'">
          <input v-model="form.content.ssid" class="input" maxlength="64" placeholder="请输入 Wi-Fi 名称" />
          <picker :range="wifiSecurityOptions" range-key="label" :value="wifiSecurityIndex" @change="handleSecurityChange">
            <view class="picker-field">
              <text class="picker-label">加密方式</text>
              <text class="picker-value">{{ wifiSecurityLabel }}</text>
            </view>
          </picker>
          <input v-model="form.content.password" class="input" maxlength="64" :disabled="form.content.security === 'nopass'" placeholder="请输入 Wi-Fi 密码" />
          <view class="switch-row">
            <text class="switch-label">隐藏网络</text>
            <switch :checked="form.content.hidden" color="#4f7cff" @change="handleHiddenChange" />
          </view>
        </template>
      </view>

      <view class="payload-card">
        <text class="payload-label">编码预览</text>
        <text class="payload-value">{{ previewContent || '请先填写内容' }}</text>
      </view>

      <button class="primary-btn" @click="generate">生成二维码</button>
      <canvas canvas-id="qrcodeCanvas" id="qrcodeCanvas" class="canvas"></canvas>
      <button class="ghost-btn" @click="saveToAlbum">保存图片</button>
    </view>
  </view>
</template>

<script>
import { createQrMatrix } from '../../utils/qrcode.js'
import { buildQrPayload, getQrTypeLabel, validateQrForm } from '../../utils/qrPayload.js'
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

const QR_TYPES = [
  { value: 'text', label: '文本' },
  { value: 'url', label: '链接' },
  { value: 'phone', label: '电话' },
  { value: 'sms', label: '短信' },
  { value: 'email', label: '邮件' },
  { value: 'wifi', label: 'Wi-Fi' }
]

const DEFAULT_FORM = {
  type: 'url',
  content: {
    text: '',
    url: 'https://example.com',
    phone: '',
    message: '',
    email: '',
    subject: '',
    body: '',
    ssid: '',
    security: 'WPA',
    password: '',
    hidden: false
  }
}

export default {
  data() {
    return {
      qrTypes: QR_TYPES,
      wifiSecurityOptions: [
        { label: 'WPA/WPA2', value: 'WPA' },
        { label: 'WEP', value: 'WEP' },
        { label: '无密码', value: 'nopass' }
      ],
      form: JSON.parse(JSON.stringify(DEFAULT_FORM)),
      currentMatrix: [],
      lastPayload: ''
    }
  },
  computed: {
    activeType() {
      return this.form.type
    },
    previewContent() {
      return buildQrPayload(this.form)
    },
    wifiSecurityIndex() {
      var index = this.wifiSecurityOptions.findIndex((item) => item.value === this.form.content.security)
      return index === -1 ? 0 : index
    },
    wifiSecurityLabel() {
      return this.wifiSecurityOptions[this.wifiSecurityIndex].label
    }
  },
  onReady() {
    this.generate()
  },
  methods: {
    switchType(type) {
      this.form.type = type
      this.currentMatrix = []
      this.lastPayload = ''
    },
    handleSecurityChange(event) {
      var next = this.wifiSecurityOptions[event.detail.value]
      this.form.content.security = next.value
      if (next.value === 'nopass') {
        this.form.content.password = ''
      }
    },
    handleHiddenChange(event) {
      this.form.content.hidden = !!event.detail.value
    },
    drawMatrix(matrix) {
      var size = 220
      var padding = 12
      var cell = (size - padding * 2) / matrix.length
      var ctx = uni.createCanvasContext('qrcodeCanvas', this)
      ctx.setFillStyle('#ffffff')
      ctx.fillRect(0, 0, size, size)
      ctx.setFillStyle('#000000')
      matrix.forEach(function (row, rowIndex) {
        row.forEach(function (dark, colIndex) {
          if (dark) {
            ctx.fillRect(padding + colIndex * cell, padding + rowIndex * cell, cell, cell)
          }
        })
      })
      ctx.draw()
    },
    async generate() {
      var message = validateQrForm(this.form)
      if (message) {
        uni.showToast({ title: message, icon: 'none' })
        return
      }
      var payload = buildQrPayload(this.form)
      this.lastPayload = payload
      this.currentMatrix = createQrMatrix(payload)
      this.drawMatrix(this.currentMatrix)
      await recordHistoryIfLoggedIn({
        toolCode: 'qrcode-generator',
        toolName: '二维码生成',
        summary: getQrTypeLabel(this.form.type) + '二维码：内容长度 ' + payload.length
      })
    },
    saveToAlbum() {
      var self = this
      if (!this.currentMatrix.length) {
        uni.showToast({ title: '请先生成二维码', icon: 'none' })
        return
      }
      uni.canvasToTempFilePath(
        {
          canvasId: 'qrcodeCanvas',
          success: function (res) {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                uni.showToast({ title: '保存成功', icon: 'none' })
              },
              fail: function () {
                uni.showToast({ title: '保存失败，请检查相册权限', icon: 'none' })
              }
            })
          },
          fail: function () {
            uni.showToast({ title: '当前环境不支持保存', icon: 'none' })
          }
        },
        self
      )
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
  box-shadow: 0 18rpx 48rpx rgba(15, 23, 42, 0.06);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24rpx;
  gap: 16rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #111827;
}

.section-tip {
  font-size: 24rpx;
  color: #64748b;
}

.type-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.type-chip {
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
}

.type-chip-active {
  background: linear-gradient(135deg, #4f7cff 0%, #6d5efc 100%);
  box-shadow: 0 10rpx 24rpx rgba(79, 124, 255, 0.2);
}

.type-chip-text {
  color: #334155;
  font-size: 26rpx;
  font-weight: 600;
}

.type-chip-text-active {
  color: #fff;
}

.form-panel {
  margin-top: 24rpx;
}

.input,
.textarea,
.picker-field,
.payload-card,
.switch-row {
  background: #f8fafc;
  border-radius: 22rpx;
}

.input,
.picker-field,
.switch-row {
  min-height: 92rpx;
  box-sizing: border-box;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}

.input {
  width: 100%;
}

.textarea {
  width: 100%;
  min-height: 220rpx;
  padding: 24rpx;
  box-sizing: border-box;
  margin-bottom: 16rpx;
}

.textarea-compact {
  min-height: 160rpx;
}

.picker-field,
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-label,
.switch-label,
.payload-label {
  color: #64748b;
  font-size: 26rpx;
}

.picker-value {
  color: #111827;
  font-weight: 600;
}

.payload-card {
  padding: 22rpx 24rpx;
  margin: 12rpx 0 20rpx;
}

.payload-value {
  display: block;
  margin-top: 12rpx;
  color: #0f172a;
  font-size: 26rpx;
  line-height: 1.5;
  word-break: break-all;
}

.canvas {
  width: 440rpx;
  height: 440rpx;
  margin: 28rpx auto;
  background: #fff;
  border-radius: 24rpx;
}

.primary-btn {
  background: linear-gradient(135deg, #4f7cff 0%, #6d5efc 100%);
  color: #fff;
  margin-top: 8rpx;
  border: none;
}

.primary-btn::after,
.ghost-btn::after {
  border: none;
}

.ghost-btn {
  background: #eef2ff;
  color: #4f46e5;
}
</style>
