<template>
  <view class="tool-card" :style="{ background: (tool.color || '#4f7cff') + '18' }" @click="openTool">
    <view class="tool-card__header">
      <text class="tool-card__icon">{{ tool.icon }}</text>
      <text class="tool-card__favorite" @click.stop="toggleFavorite">{{ favorite ? '★' : '☆' }}</text>
    </view>
    <text class="tool-card__name">{{ tool.name }}</text>
    <text class="tool-card__desc">{{ tool.description }}</text>
  </view>
</template>

<script>
export default {
  props: {
    tool: { type: Object, required: true },
    favorite: { type: Boolean, default: false }
  },
  methods: {
    openTool() {
      this.$emit('open', this.tool)
    },
    toggleFavorite() {
      this.$emit('favorite', this.tool)
    }
  }
}
</script>

<style scoped>
.tool-card {
  border-radius: 24rpx;
  padding: 24rpx;
  min-height: 220rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.tool-card__header {
  display: flex;
  justify-content: space-between;
}
.tool-card__icon {
  font-size: 48rpx;
}
.tool-card__favorite {
  font-size: 36rpx;
  color: #f59e0b;
}
.tool-card__name {
  font-size: 32rpx;
  font-weight: 700;
}
.tool-card__desc {
  color: #6b7280;
  font-size: 24rpx;
  line-height: 1.5;
}
</style>
