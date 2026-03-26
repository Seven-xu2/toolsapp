export function timestampToText(value, isMillis = false) {
  const time = Number(value)
  if (Number.isNaN(time)) {
    return ''
  }
  const date = new Date(isMillis ? time : time * 1000)
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function textToTimestamp(text, isMillis = false) {
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return isMillis ? `${date.getTime()}` : `${Math.floor(date.getTime() / 1000)}`
}
