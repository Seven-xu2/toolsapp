<template>
  <view class="page flashlight-page">
    <view class="card">
      <text class="status-icon">{{ enabled ? '💡' : '🔦' }}</text>
      <text class="status-text">{{ supportMessage }}</text>
      <button class="primary-btn" @click="toggleTorch">{{ enabled ? '关闭' : '开启' }}</button>
    </view>
  </view>
</template>

<script>
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

export default {
  data() {
    return {
      enabled: false,
      cameraHolder: {
        camera: null
      }
    }
  },
  computed: {
    supportMessage() {
      if (!this.isAndroidApp()) {
        return '当前环境不支持手电筒，请使用 Android APK。'
      }
      return this.enabled ? '手电筒已开启' : '点击按钮开启手电筒'
    }
  },
  methods: {
    isAndroidApp() {
      return typeof plus !== 'undefined' && plus.os && plus.os.name === 'Android'
    },
    async toggleTorch() {
      if (!this.isAndroidApp()) {
        uni.showToast({ title: '仅支持 Android APK', icon: 'none' })
        return
      }
      try {
        var Camera = plus.android.importClass('android.hardware.Camera')
        if (!this.enabled) {
          this.cameraHolder.camera = Camera.open()
          var parameters = this.cameraHolder.camera.getParameters()
          plus.android.importClass(parameters)
          parameters.setFlashMode('torch')
          this.cameraHolder.camera.setParameters(parameters)
          this.cameraHolder.camera.startPreview()
          this.enabled = true
          await recordHistoryIfLoggedIn({
            toolCode: 'flashlight',
            toolName: '手电筒',
            summary: '手电筒已开启'
          })
          return
        }
        this.cameraHolder.camera.stopPreview()
        this.cameraHolder.camera.release()
        this.cameraHolder.camera = null
        this.enabled = false
      } catch (error) {
        uni.showToast({ title: '设备不支持或权限不足', icon: 'none' })
      }
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
  padding: 48rpx 32rpx;
  text-align: center;
}
.status-icon {
  display: block;
  font-size: 120rpx;
}
.status-text {
  display: block;
  margin: 24rpx 0 32rpx;
  color: #475569;
}
.primary-btn {
  background: #111827;
  color: #fff;
}
</style>
