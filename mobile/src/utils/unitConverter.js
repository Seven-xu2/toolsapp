export function convertUnit(category, value, fromUnit, toUnit) {
  const num = Number(value)
  if (Number.isNaN(num)) {
    return ''
  }

  const map = {
    length: { m: 1, cm: 0.01, km: 1000, mm: 0.001 },
    weight: { kg: 1, g: 0.001, lb: 0.45359237, ton: 1000 },
    area: { sqm: 1, sqft: 0.09290304, mu: 666.6666667, hectare: 10000 },
    volume: { l: 1, ml: 0.001, m3: 1000, gal: 3.785411784 }
  }

  if (category === 'temperature') {
    return convertTemperature(num, fromUnit, toUnit)
  }

  const categoryMap = map[category]
  if (!categoryMap || !categoryMap[fromUnit] || !categoryMap[toUnit]) {
    return ''
  }
  return (num * categoryMap[fromUnit] / categoryMap[toUnit]).toFixed(6).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
}

function convertTemperature(value, fromUnit, toUnit) {
  let celsius = value
  if (fromUnit === 'f') {
    celsius = (value - 32) * 5 / 9
  }
  if (fromUnit === 'k') {
    celsius = value - 273.15
  }
  if (toUnit === 'c') {
    return celsius.toFixed(2).replace(/\.00$/, '')
  }
  if (toUnit === 'f') {
    return (celsius * 9 / 5 + 32).toFixed(2).replace(/\.00$/, '')
  }
  return (celsius + 273.15).toFixed(2).replace(/\.00$/, '')
}

export const unitOptions = {
  length: ['m', 'cm', 'km', 'mm'],
  weight: ['kg', 'g', 'lb', 'ton'],
  temperature: ['c', 'f', 'k'],
  area: ['sqm', 'sqft', 'mu', 'hectare'],
  volume: ['l', 'ml', 'm3', 'gal']
}
