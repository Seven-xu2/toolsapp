<template>
  <view class="page qrcode-page">
    <view class="card">
      <textarea v-model="text" class="textarea" maxlength="200" placeholder="请输入文本或链接" />
      <button class="primary-btn" @click="generate">生成二维码</button>
      <canvas canvas-id="qrcodeCanvas" id="qrcodeCanvas" class="canvas"></canvas>
      <button class="ghost-btn" @click="saveToAlbum">保存图片</button>
    </view>
  </view>
</template>

<script>
import { createQrMatrix } from '../../utils/qrcode.js'
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

export default {
  data() {
    return {
      text: 'https://example.com',
      currentMatrix: []
    }
  },
  onReady() {
    this.generate()
  },
  methods: {
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
      if (!this.text) {
        uni.showToast({ title: '请输入内容', icon: 'none' })
        return
      }
      this.currentMatrix = createQrMatrix(this.text)
      this.drawMatrix(this.currentMatrix)
      await recordHistoryIfLoggedIn({
        toolCode: 'qrcode-generator',
        toolName: '二维码生成',
        summary: '二维码：内容长度 ' + this.text.length
      })
    },
    saveToAlbum() {
      var self = this
      if (!this.currentMatrix.length) {
        uni.showToast({ title: '请先生成二维码', icon: 'none' })
        return
      }
      uni.canvasToTempFilePath({
        canvasId: 'qrcodeCanvas',
        success: function (res) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
              uni.showToast({ title: '保存成功', icon: 'none' })
            },
            fail: function () {
              uni.showToast({ title: '保存失败', icon: 'none' })
            }
          })
        },
        fail: function () {
          uni.showToast({ title: '当前环境不支持保存', icon: 'none' })
        }
      }, self)
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
  min-height: 180rpx;
  background: #f5f7fb;
  border-radius: 18rpx;
  padding: 24rpx;
  box-sizing: border-box;
}
.canvas {
  width: 440rpx;
  height: 440rpx;
  margin: 28rpx auto;
  background: #fff;
}
.primary-btn {
  background: #4f7cff;
  color: #fff;
  margin-top: 20rpx;
}
.ghost-btn {
  background: #eef2ff;
  color: #4f46e5;
}
</style>
