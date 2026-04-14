<script>
import { runAutoLocation } from './src/utils/location.js'

export default {
  onLaunch() {
    console.log('Tools App launched')
    runAutoLocation(false)
  },
  onShow() {
    runAutoLocation(false)
  }
}
</script>

<style>
page {
  background: #f5f7fb;
  color: #1f2937;
  font-size: 28rpx;
}
button {
  border-radius: 16rpx;
}
</style>
