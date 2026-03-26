export function trimText(text) {
  return (text || '').trim()
}

export function toUpper(text) {
  return (text || '').toUpperCase()
}

export function toLower(text) {
  return (text || '').toLowerCase()
}

export function linesToComma(text) {
  return (text || '').split(/\r?\n+/).filter(Boolean).join(',')
}

export function commaToLines(text) {
  return (text || '').split(',').map((item) => item.trim()).filter(Boolean).join('\n')
}

export function countChars(text) {
  return `${(text || '').length}`
}
