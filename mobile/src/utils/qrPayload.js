const QR_TYPE_MAP = {
  text: '文本',
  url: '链接',
  phone: '电话',
  sms: '短信',
  email: '邮件',
  wifi: 'Wi-Fi'
}

function safeText(value) {
  return String(value || '').trim()
}

function escapeWifiValue(value) {
  return safeText(value).replace(/([\\;,:\"])/g, '\\$1')
}

export function getQrTypeLabel(type) {
  return QR_TYPE_MAP[type] || QR_TYPE_MAP.text
}

export function validateQrForm(form) {
  var type = form && form.type ? form.type : 'text'
  var content = form && form.content ? form.content : {}

  if (type === 'text' && !safeText(content.text)) {
    return '请输入文本内容'
  }
  if (type === 'url' && !safeText(content.url)) {
    return '请输入链接地址'
  }
  if (type === 'phone' && !safeText(content.phone)) {
    return '请输入电话号码'
  }
  if (type === 'sms') {
    if (!safeText(content.phone)) {
      return '请输入短信号码'
    }
    if (!safeText(content.message)) {
      return '请输入短信内容'
    }
  }
  if (type === 'email') {
    if (!safeText(content.email)) {
      return '请输入邮箱地址'
    }
    if (!safeText(content.subject) && !safeText(content.body)) {
      return '请至少填写主题或正文'
    }
  }
  if (type === 'wifi') {
    if (!safeText(content.ssid)) {
      return '请输入 Wi-Fi 名称'
    }
    if (safeText(content.security) !== 'nopass' && !safeText(content.password)) {
      return '请输入 Wi-Fi 密码'
    }
  }
  return ''
}

export function buildQrPayload(form) {
  var type = form && form.type ? form.type : 'text'
  var content = form && form.content ? form.content : {}

  if (type === 'url') {
    return safeText(content.url)
  }
  if (type === 'phone') {
    return 'TEL:' + safeText(content.phone)
  }
  if (type === 'sms') {
    return 'SMSTO:' + safeText(content.phone) + ':' + safeText(content.message)
  }
  if (type === 'email') {
    return 'MATMSG:TO:' + safeText(content.email) + ';SUB:' + safeText(content.subject) + ';BODY:' + safeText(content.body) + ';;'
  }
  if (type === 'wifi') {
    return 'WIFI:T:' + safeText(content.security || 'WPA') + ';S:' + escapeWifiValue(content.ssid) + ';P:' + escapeWifiValue(content.password) + ';H:' + (content.hidden ? 'true' : 'false') + ';;'
  }
  return safeText(content.text)
}
