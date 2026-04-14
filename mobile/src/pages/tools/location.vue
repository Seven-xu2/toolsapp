<template>
  <view class="page location-page">
    <view class="hero-card">
      <text class="hero-title">精确定位</text>
      <text class="hero-subtitle">首次授权后，后续打开 App 会自动定位并更新地址</text>
      <view class="switch-row">
        <text class="switch-label">自动定位</text>
        <switch :checked="autoLocateEnabled" color="#4f7cff" @change="toggleAutoLocate" />
      </view>
    </view>

    <view class="card">
      <text class="section-title">当前位置</text>
      <text class="address-text">{{ locationText }}</text>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">经纬度</text>
          <text class="info-value">{{ coordinateText }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">定位精度</text>
          <text class="info-value">{{ accuracyText }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">附近地点</text>
          <text class="info-value">{{ poiText }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">行政区划</text>
          <text class="info-value">{{ districtText }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">更新时间</text>
          <text class="info-value">{{ updateTimeText }}</text>
        </view>
      </view>
      <button class="primary-btn" :loading="loading" @click="refreshLocation">重新定位</button>
      <button class="ghost-btn" @click="openLocationOnMap">地图打开</button>
    </view>
  </view>
</template>

<script>
import { recordHistoryIfLoggedIn } from '../../utils/historyRecorder.js'
import {
  formatLocationSummary,
  getStoredLocationState,
  isAutoLocationEnabled,
  requestPreciseLocationManually,
  runAutoLocation,
  setAutoLocationEnabled
} from '../../utils/location.js'

export default {
  data() {
    return {
      loading: false,
      locationState: null,
      autoLocateEnabled: false
    }
  },
  computed: {
    locationText() {
      return formatLocationSummary(this.locationState)
    },
    coordinateText() {
      if (!this.locationState) {
        return '--'
      }
      return Number(this.locationState.longitude).toFixed(6) + ', ' + Number(this.locationState.latitude).toFixed(6)
    },
    accuracyText() {
      if (!this.locationState || !this.locationState.horizontalAccuracy) {
        return '--'
      }
      return '约 ±' + Math.round(this.locationState.horizontalAccuracy) + ' 米'
    },
    poiText() {
      if (!this.locationState) {
        return '--'
      }
      if (this.locationState.poiName) {
        return this.locationState.poiName + (this.locationState.poiDistance ? '（约 ' + this.locationState.poiDistance + ' 米）' : '')
      }
      if (this.locationState.roadName) {
        return this.locationState.roadName + (this.locationState.roadDistance ? '（约 ' + this.locationState.roadDistance + ' 米）' : '')
      }
      return '--'
    },
    districtText() {
      if (!this.locationState) {
        return '--'
      }
      return [
        this.locationState.province,
        this.locationState.city,
        this.locationState.district,
        this.locationState.township
      ].filter(Boolean).join(' / ') || '--'
    },
    updateTimeText() {
      if (!this.locationState || !this.locationState.locatedAt) {
        return '--'
      }
      return this.locationState.locatedAt.replace('T', ' ').replace('Z', '')
    }
  },
  async onShow() {
    this.autoLocateEnabled = isAutoLocationEnabled()
    this.locationState = getStoredLocationState()
    if (!this.locationState && this.autoLocateEnabled) {
      this.locationState = await runAutoLocation(true)
    }
  },
  methods: {
    async refreshLocation() {
      this.loading = true
      try {
        this.locationState = await requestPreciseLocationManually()
        await recordHistoryIfLoggedIn({
          toolCode: 'location',
          toolName: '精确定位',
          summary: '定位到 ' + formatLocationSummary(this.locationState)
        })
        uni.showToast({ title: '定位成功', icon: 'none' })
      } catch (error) {
        uni.showToast({ title: error.message || '定位失败', icon: 'none' })
      } finally {
        this.autoLocateEnabled = isAutoLocationEnabled()
        this.loading = false
      }
    },
    async toggleAutoLocate(event) {
      var nextValue = !!event.detail.value
      if (!nextValue) {
        setAutoLocationEnabled(false)
        this.autoLocateEnabled = false
        uni.showToast({ title: '已关闭自动定位', icon: 'none' })
        return
      }
      this.autoLocateEnabled = true
      setAutoLocationEnabled(true)
      if (!this.locationState) {
        await this.refreshLocation()
        return
      }
      uni.showToast({ title: '已开启自动定位', icon: 'none' })
    },
    openLocationOnMap() {
      if (!this.locationState) {
        uni.showToast({ title: '暂无定位信息', icon: 'none' })
        return
      }
      uni.openLocation({
        latitude: this.locationState.latitude,
        longitude: this.locationState.longitude,
        name: this.locationState.poiName || '当前位置',
        address: this.locationState.formattedAddress || '当前位置'
      })
    }
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.hero-card {
  background: linear-gradient(135deg, #4f7cff 0%, #6d5efc 100%);
  color: #fff;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 18rpx 42rpx rgba(79, 124, 255, 0.18);
}

.hero-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
}

.hero-subtitle {
  display: block;
  margin-top: 16rpx;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.92);
}

.switch-row {
  margin-top: 28rpx;
  padding: 22rpx 24rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-label {
  font-weight: 600;
}

.card {
  margin-top: 24rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 14rpx 38rpx rgba(15, 23, 42, 0.06);
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.address-text {
  display: block;
  margin-top: 18rpx;
  color: #0f172a;
  line-height: 1.7;
}

.info-list {
  margin-top: 24rpx;
  background: #f8fafc;
  border-radius: 24rpx;
  padding: 12rpx 24rpx;
}

.info-item {
  padding: 18rpx 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24rpx;
  border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #64748b;
}

.info-value {
  color: #0f172a;
  text-align: right;
  flex: 1;
  word-break: break-all;
}

.primary-btn {
  margin-top: 24rpx;
  background: linear-gradient(135deg, #4f7cff 0%, #6d5efc 100%);
  color: #fff;
  border: none;
}

.primary-btn::after,
.ghost-btn::after {
  border: none;
}

.ghost-btn {
  margin-top: 16rpx;
  background: #eef2ff;
  color: #4f46e5;
}
</style>
