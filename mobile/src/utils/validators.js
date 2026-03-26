export function isPhone(phone) {
  return /^1\d{10}$/.test(phone || '')
}

export function maskPhone(phone) {
  return (phone || '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
