const configs = {
  'h5-local': {
    baseUrl: 'http://127.0.0.1:8081/api/v1'
  },
  'app-local': {
    baseUrl: uni.getStorageSync('APP_API_BASE_URL') || 'http://192.168.1.100:8080/api/v1'
  }
}

let mode = 'h5-local'
// #ifdef APP-PLUS
mode = 'app-local'
// #endif

export function getEnvConfig() {
  return {
    mode,
    ...configs[mode]
  }
}
