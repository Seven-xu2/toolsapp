<template>
  <view class="page flashlight-page">
    <view class="card hero-card">
      <view :class="['light-orb', enabled ? 'light-orb-on' : 'light-orb-off']">
        <text class="status-icon">{{ enabled ? '💡' : '🔦' }}</text>
      </view>
      <text class="title">手电筒</text>
      <text class="status-text">{{ supportMessage }}</text>
      <button :class="['primary-btn', enabled ? 'primary-btn-off' : 'primary-btn-on']" @click="toggleTorch">
        {{ enabled ? '关闭手电筒' : '开启手电筒' }}
      </button>
      <text class="tip-text">{{ hintText }}</text>
    </view>
  </view>
</template>

<script>
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'

export default {
  data() {
    return {
      enabled: false,
      initializing: false,
      lastError: '',
      torchController: null,
      legacyCamera: null
    }
  },
  computed: {
    supportMessage() {
      if (!this.isAndroidApp()) {
        return '当前环境不支持手电筒，请使用 Android APK。'
      }
      if (this.lastError) {
        return this.lastError
      }
      if (this.initializing) {
        return '正在切换手电筒...'
      }
      return this.enabled ? '手电筒已开启' : '点击按钮开启手电筒'
    },
    hintText() {
      if (!this.isAndroidApp()) {
        return '浏览器和小程序环境无法直接控制设备闪光灯。'
      }
      return '已补充 Android 权限请求，并优先使用系统 Torch API。'
    }
  },
  onHide() {
    this.ensureTorchOff()
  },
  onUnload() {
    this.ensureTorchOff()
  },
  methods: {
    isAndroidApp() {
      return typeof plus !== 'undefined' && plus.os && plus.os.name === 'Android'
    },
    getMainActivity() {
      return plus.android.runtimeMainActivity()
    },
    requestCameraPermission() {
      var self = this
      return new Promise(function (resolve) {
        if (!self.isAndroidApp() || typeof plus.android.requestPermissions !== 'function') {
          resolve(true)
          return
        }
        plus.android.requestPermissions(
          ['android.permission.CAMERA'],
          function (result) {
            var deniedAlways = result.deniedAlways || []
            var deniedPresent = result.deniedPresent || []
            resolve(!deniedAlways.length && !deniedPresent.length)
          },
          function () {
            resolve(false)
          }
        )
      })
    },
    createCamera2Controller() {
      var mainActivity = this.getMainActivity()
      var BuildVersion = plus.android.importClass('android.os.Build$VERSION')
      var sdkInt = BuildVersion.SDK_INT
      if (sdkInt < 23) {
        return null
      }
      var Context = plus.android.importClass('android.content.Context')
      var CameraCharacteristics = plus.android.importClass('android.hardware.camera2.CameraCharacteristics')
      var cameraManager = mainActivity.getSystemService(Context.CAMERA_SERVICE)
      plus.android.importClass(cameraManager)
      var cameraIds = cameraManager.getCameraIdList()
      var targetCameraId = ''
      for (var index = 0; index < cameraIds.length; index += 1) {
        var cameraId = cameraIds[index]
        var characteristics = cameraManager.getCameraCharacteristics(cameraId)
        var hasFlash = characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE)
        var lensFacing = characteristics.get(CameraCharacteristics.LENS_FACING)
        if (hasFlash && lensFacing === CameraCharacteristics.LENS_FACING_BACK) {
          targetCameraId = cameraId
          break
        }
        if (hasFlash && !targetCameraId) {
          targetCameraId = cameraId
        }
      }
      if (!targetCameraId) {
        return null
      }
      return {
        turnOn: function () {
          cameraManager.setTorchMode(targetCameraId, true)
        },
        turnOff: function () {
          cameraManager.setTorchMode(targetCameraId, false)
        }
      }
    },
    createLegacyController() {
      var Camera = plus.android.importClass('android.hardware.Camera')
      var camera = Camera.open()
      if (!camera) {
        return null
      }
      var parameters = camera.getParameters()
      plus.android.importClass(parameters)
      parameters.setFlashMode('torch')
      return {
        turnOn: function () {
          camera.setParameters(parameters)
          camera.startPreview()
        },
        turnOff: function () {
          try {
            camera.stopPreview()
          } catch (error) {
          }
          camera.release()
        }
      }
    },
    async toggleTorch() {
      if (!this.isAndroidApp()) {
        uni.showToast({ title: '仅支持 Android APK', icon: 'none' })
        return
      }
      this.lastError = ''
      this.initializing = true
      try {
        if (this.enabled) {
          this.ensureTorchOff()
          return
        }
        var granted = await this.requestCameraPermission()
        if (!granted) {
          this.lastError = '请在系统设置中允许相机权限后再试'
          uni.showToast({ title: this.lastError, icon: 'none' })
          return
        }
        this.torchController = this.createCamera2Controller() || this.createLegacyController()
        if (!this.torchController) {
          throw new Error('torch unavailable')
        }
        this.torchController.turnOn()
        this.enabled = true
        await recordHistoryIfLoggedIn({
          toolCode: 'flashlight',
          toolName: '手电筒',
          summary: '手电筒已开启'
        })
      } catch (error) {
        this.ensureTorchOff()
        this.lastError = '手电筒打开失败，请确认已授予相机权限'
        uni.showToast({ title: this.lastError, icon: 'none' })
      } finally {
        this.initializing = false
      }
    },
    ensureTorchOff() {
      if (this.torchController) {
        try {
          this.torchController.turnOff()
        } catch (error) {
        }
      }
      this.torchController = null
      this.enabled = false
    }
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.hero-card {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-radius: 32rpx;
  padding: 56rpx 36rpx;
  text-align: center;
  color: #fff;
  box-shadow: 0 22rpx 56rpx rgba(15, 23, 42, 0.18);
}

.light-orb {
  width: 180rpx;
  height: 180rpx;
  border-radius: 999rpx;
  margin: 0 auto 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.light-orb-on {
  background: radial-gradient(circle, #fff7c2 0%, #fde68a 45%, rgba(253, 230, 138, 0.18) 100%);
  box-shadow: 0 0 0 16rpx rgba(253, 230, 138, 0.12), 0 0 72rpx rgba(253, 230, 138, 0.36);
}

.light-orb-off {
  background: radial-gradient(circle, #334155 0%, #1e293b 100%);
}

.status-icon {
  display: block;
  font-size: 92rpx;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
}

.status-text {
  display: block;
  margin: 22rpx 0 28rpx;
  color: rgba(226, 232, 240, 0.9);
  line-height: 1.6;
}

.tip-text {
  display: block;
  margin-top: 22rpx;
  color: rgba(148, 163, 184, 0.95);
  font-size: 24rpx;
  line-height: 1.6;
}

.primary-btn {
  border: none;
  border-radius: 999rpx;
  color: #fff;
  font-weight: 700;
}

.primary-btn::after {
  border: none;
}

.primary-btn-on {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
}

.primary-btn-off {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}
</style>
