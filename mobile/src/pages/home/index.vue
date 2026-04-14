<template>
  <view class="page home-page">
    <view class="hero">
      <view>
        <text class="hero__title">{{ welcomeText }}</text>
        <text class="hero__subtitle">{{ subtitleText }}</text>
      </view>
      <button class="profile-btn" @click="goProfile">个人中心</button>
    </view>

    <view v-if="authStore.isGuest() || toolStore.state.usingLocalCatalog" class="notice-card">
      <text class="notice-title">当前为游客/离线模式</text>
      <text class="notice-text">本地工具可直接使用，收藏、历史、个人中心及后续云端工具需要注册登录并连接后端服务。</text>
    </view>

    <view class="quick-nav">
      <view class="quick-item" @click="goFavorites">
        <text class="quick-item__icon">★</text>
        <text>收藏</text>
      </view>
      <view class="quick-item" @click="goHistory">
        <text class="quick-item__icon">⏱</text>
        <text>历史</text>
      </view>
      <view class="quick-item" @click="goProfile">
        <text class="quick-item__icon">👤</text>
        <text>我的</text>
      </view>
    </view>

    <view class="grid">
      <ToolCard
        v-for="item in toolStore.state.tools"
        :key="item.code"
        :tool="item"
        :favorite="toolStore.isFavorite(item.code)"
        @open="openTool"
        @favorite="toggleFavorite"
      />
    </view>
  </view>
</template>

<script>
import ToolCard from '../../components/ToolCard.vue'
import { useAuthStore } from '../../stores/auth.js'
import { useToolStore } from '../../stores/tool.js'
import { ensureCloudAccess } from '../../utils/cloudAccess.js'

export default {
  components: {
    ToolCard
  },
  data() {
    return {
      authStore: useAuthStore(),
      toolStore: useToolStore()
    }
  },
  computed: {
    welcomeText() {
      var user = this.authStore.state.user
      var nickname = user && user.nickname
      return nickname ? '你好，' + nickname : '你好，游客'
    },
    subtitleText() {
      if (this.authStore.isGuest()) {
        return '游客模式下可直接使用本地工具'
      }
      return '选择一个工具开始使用'
    }
  },
  async onShow() {
    try {
      await this.toolStore.loadTools()
      if (this.authStore.isLoggedIn()) {
        await this.authStore.fetchProfile()
        await this.toolStore.loadFavoriteCodes()
      } else {
        this.toolStore.state.favoriteCodes = []
      }
    } catch (error) {
      this.toolStore.state.tools = this.toolStore.state.tools && this.toolStore.state.tools.length
        ? this.toolStore.state.tools
        : []
      this.toolStore.state.favoriteCodes = []
      uni.showToast({ title: '已切换到离线模式', icon: 'none' })
    }
  },
  methods: {
    openTool(tool) {
      if (tool.requiresBackend && !ensureCloudAccess(tool.name)) {
        return
      }
      if (!tool.route) {
        uni.showToast({ title: '该工具暂不可用', icon: 'none' })
        return
      }
      uni.navigateTo({ url: tool.route })
    },
    async toggleFavorite(tool) {
      if (!ensureCloudAccess('收藏功能')) {
        return
      }
      await this.toolStore.toggleFavorite(tool.code)
    },
    goFavorites() {
      if (!ensureCloudAccess('收藏功能')) {
        return
      }
      uni.navigateTo({ url: '/src/pages/favorites/index' })
    },
    goHistory() {
      if (!ensureCloudAccess('历史记录')) {
        return
      }
      uni.navigateTo({ url: '/src/pages/history/index' })
    },
    goProfile() {
      if (!ensureCloudAccess('个人中心')) {
        return
      }
      uni.navigateTo({ url: '/src/pages/profile/index' })
    }
  }
}
</script>

<style scoped>
.page {
  padding: 28rpx;
}
.hero {
  background: linear-gradient(135deg, #4f7cff, #6d8fff);
  color: #fff;
  border-radius: 32rpx;
  padding: 36rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero__title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
}
.hero__subtitle {
  display: block;
  margin-top: 12rpx;
  opacity: 0.9;
}
.profile-btn {
  background: rgba(255,255,255,0.16);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}
.notice-card {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-top: 24rpx;
}
.notice-title {
  display: block;
  font-weight: 700;
  color: #9a3412;
}
.notice-text {
  display: block;
  margin-top: 12rpx;
  color: #9a3412;
  line-height: 1.7;
}
.quick-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin: 28rpx 0;
}
.quick-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 26rpx 16rpx;
  text-align: center;
  box-shadow: 0 12rpx 28rpx rgba(15, 23, 42, 0.05);
}
.quick-item__icon {
  display: block;
  font-size: 40rpx;
  margin-bottom: 12rpx;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
</style>