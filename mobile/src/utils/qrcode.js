const QRCode = require('./vendor/qrcode/index.js')
const QRErrorCorrectLevel = require('./vendor/qrcode/QRErrorCorrectLevel.js')

export function createQrMatrix(text) {
  if (!text) {
    return []
  }
  const qr = new QRCode(0, QRErrorCorrectLevel.M)
  qr.addData(text)
  qr.make()
  const count = qr.getModuleCount()
  const matrix = []
  for (let row = 0; row < count; row += 1) {
    const current = []
    for (let col = 0; col < count; col += 1) {
      current.push(qr.isDark(row, col))
    }
    matrix.push(current)
  }
  return matrix
}
