import test from 'node:test'
import assert from 'node:assert/strict'
import { convertUnit } from '../src/utils/unitConverter.js'
import { timestampToText, textToTimestamp } from '../src/utils/timestamp.js'
import { commaToLines, countChars, linesToComma, toLower, toUpper, trimText } from '../src/utils/textTools.js'
import { buildQrPayload, validateQrForm } from '../src/utils/qrPayload.js'
import { buildAmapRegeoUrl, formatLocationSummary, normalizeLocationSnapshot, parseAmapRegeoResponse } from '../src/utils/location.js'

test('unit conversion works', () => {
  assert.equal(convertUnit('length', 100, 'cm', 'm'), '1')
  assert.equal(convertUnit('temperature', 0, 'c', 'f'), '32')
})

test('timestamp conversion works', () => {
  assert.equal(textToTimestamp('2026-03-25 00:00:00', false).length, 10)
  assert.match(timestampToText(1711286400, false), /^2024-/)
})

test('text tools work', () => {
  assert.equal(trimText('  hi  '), 'hi')
  assert.equal(toUpper('abc'), 'ABC')
  assert.equal(toLower('ABC'), 'abc')
  assert.equal(linesToComma('a\nb'), 'a,b')
  assert.equal(commaToLines('a,b'), 'a\nb')
  assert.equal(countChars('hello'), '5')
})

test('qr payload formats multiple content types', () => {
  assert.equal(buildQrPayload({ type: 'text', content: { text: 'hello' } }), 'hello')
  assert.equal(buildQrPayload({ type: 'phone', content: { phone: '13800138000' } }), 'TEL:13800138000')
  assert.equal(buildQrPayload({ type: 'sms', content: { phone: '13800138000', message: 'hi' } }), 'SMSTO:13800138000:hi')
  assert.equal(buildQrPayload({ type: 'wifi', content: { security: 'WPA', ssid: 'Office WiFi', password: 'pass123', hidden: false } }), 'WIFI:T:WPA;S:Office WiFi;P:pass123;H:false;;')
})

test('qr form validation catches missing fields', () => {
  assert.equal(validateQrForm({ type: 'text', content: { text: '' } }), '请输入文本内容')
  assert.equal(validateQrForm({ type: 'wifi', content: { security: 'WPA', ssid: 'Office', password: '' } }), '请输入 Wi-Fi 密码')
  assert.equal(validateQrForm({ type: 'email', content: { email: 'a@b.com', subject: '', body: '' } }), '请至少填写主题或正文')
})

test('amap reverse geocode helpers normalize data', () => {
  var parsed = parseAmapRegeoResponse({
    status: '1',
    regeocode: {
      formatted_address: '北京市朝阳区阜通东大街6号',
      addressComponent: {
        province: '北京市',
        city: [],
        district: '朝阳区',
        township: '望京街道',
        adcode: '110105',
        citycode: '010',
        streetNumber: {
          street: '阜通东大街',
          number: '6号'
        },
        building: {
          name: '望京SOHO'
        },
        neighborhood: {
          name: '望京'
        }
      },
      pois: [{ name: '望京SOHO', distance: '23', address: '阜通东大街6号' }],
      roads: [{ name: '阜通东大街', distance: '12' }]
    }
  })

  var normalized = normalizeLocationSnapshot({
    latitude: 39.98941,
    longitude: 116.480881,
    accuracy: 18,
    horizontalAccuracy: 18
  }, parsed)

  assert.equal(parsed.formattedAddress, '北京市朝阳区阜通东大街6号')
  assert.equal(normalized.poiName, '望京SOHO')
  assert.equal(formatLocationSummary(normalized), '北京市朝阳区阜通东大街6号')
  assert.match(buildAmapRegeoUrl(116.480881, 39.98941), /geocode\/regeo/)
})
