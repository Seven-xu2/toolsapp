export const localToolCatalog = [
  {
    code: 'calculator',
    name: '计算器',
    icon: '🧮',
    color: '#5B8FF9',
    description: '基础四则运算',
    enabled: 1,
    requiresBackend: false,
    route: '/src/pages/tools/calculator'
  },
  {
    code: 'unit-converter',
    name: '单位转换',
    icon: '📏',
    color: '#61DDAA',
    description: '长度重量温度换算',
    enabled: 1,
    requiresBackend: false,
    route: '/src/pages/tools/unit-converter'
  },
  {
    code: 'flashlight',
    name: '手电筒',
    icon: '🔦',
    color: '#F6BD16',
    description: '快速打开手电筒',
    enabled: 1,
    requiresBackend: false,
    route: '/src/pages/tools/flashlight'
  },
  {
    code: 'location',
    name: '精确定位',
    icon: '📍',
    color: '#22C55E',
    description: '首次授权后自动定位并解析详细地址',
    enabled: 1,
    requiresBackend: false,
    route: '/src/pages/tools/location'
  },
  {
    code: 'qrcode-generator',
    name: '二维码生成',
    icon: '🔳',
    color: '#7262FD',
    description: '支持文本、链接、Wi‑Fi 等类型',
    enabled: 1,
    requiresBackend: false,
    route: '/src/pages/tools/qrcode-generator'
  },
  {
    code: 'timestamp-converter',
    name: '时间戳转换',
    icon: '⏱️',
    color: '#78D3F8',
    description: '时间戳与日期互转',
    enabled: 1,
    requiresBackend: false,
    route: '/src/pages/tools/timestamp-converter'
  },
  {
    code: 'text-tools',
    name: '文本工具',
    icon: '📝',
    color: '#F6903D',
    description: '常用文本处理合集',
    enabled: 1,
    requiresBackend: false,
    route: '/src/pages/tools/text-tools'
  }
]

export function getLocalToolCatalog() {
  return localToolCatalog.map(function (item) {
    return Object.assign({}, item)
  })
}

export function getLocalToolMap() {
  return localToolCatalog.reduce(function (result, item) {
    result[item.code] = item
    return result
  }, {})
}
