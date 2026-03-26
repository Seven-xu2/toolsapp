import test from 'node:test'
import assert from 'node:assert/strict'
import { convertUnit } from '../src/utils/unitConverter.js'
import { timestampToText, textToTimestamp } from '../src/utils/timestamp.js'
import { commaToLines, countChars, linesToComma, toLower, toUpper, trimText } from '../src/utils/textTools.js'

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
