const AMAP_WEB_SERVICE_KEY = '9c8e2fa795303edcc32737c11b796cfa'
const LOCATION_STORAGE_KEY = 'APP_LOCATION_STATE'
const AUTO_LOCATION_KEY = 'APP_AUTO_LOCATION_ENABLED'
const INITIAL_LOCATION_REQUESTED_KEY = 'APP_INITIAL_LOCATION_REQUESTED'
const LAST_AUTO_LOCATE_AT_KEY = 'APP_LAST_AUTO_LOCATE_AT'
const AUTO_LOCATE_INTERVAL_MS = 60 * 1000

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function safeText(value) {
  return typeof value === 'string' ? value : ''
}

function safeNumber(value) {
  var number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function getStorageSync(key, fallback) {
  try {
    var value = uni.getStorageSync(key)
    return value === '' || typeof value === 'undefined' || value === null ? fallback : value
  } catch (error) {
    return fallback
  }
}

function setStorageSync(key, value) {
  try {
    uni.setStorageSync(key, value)
  } catch (error) {
  }
}

function trimCoordinate(value) {
  return safeNumber(value).toFixed(6)
}

function buildFallbackAddress(addressInfo) {
  var values = [
    addressInfo.province,
    addressInfo.city,
    addressInfo.district,
    addressInfo.township,
    addressInfo.street,
    addressInfo.streetNumber,
    addressInfo.buildingName,
    addressInfo.neighborhoodName
  ]
  return values.filter(Boolean).join('')
}

function isObjectLike(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function firstObjectItem(list) {
  return Array.isArray(list) && list.length && isObjectLike(list[0]) ? list[0] : {}
}

function isPermissionDeniedError(error) {
  var message = safeText(error && error.errMsg ? error.errMsg : error)
  return /auth deny|permission deny|permission denied|authorize no response/i.test(message)
}

export function buildAmapRegeoUrl(longitude, latitude) {
  return 'https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=' +
    encodeURIComponent(trimCoordinate(longitude) + ',' + trimCoordinate(latitude)) +
    '&key=' + encodeURIComponent(AMAP_WEB_SERVICE_KEY) +
    '&extensions=all&roadlevel=0'
}

export function parseAmapRegeoResponse(responseData) {
  var data = safeObject(responseData)
  if (String(data.status) !== '1') {
    throw new Error(safeText(data.info) || '位置解析失败')
  }

  var regeocode = safeObject(data.regeocode)
  var component = safeObject(regeocode.addressComponent)
  var streetNumber = safeObject(component.streetNumber)
  var building = safeObject(component.building)
  var neighborhood = safeObject(component.neighborhood)
  var firstPoi = firstObjectItem(regeocode.pois)
  var firstRoad = firstObjectItem(regeocode.roads)
  var cityValue = component.city

  return {
    formattedAddress: safeText(regeocode.formatted_address),
    province: safeText(component.province),
    city: Array.isArray(cityValue) ? '' : safeText(cityValue),
    district: safeText(component.district),
    township: safeText(component.township),
    adcode: safeText(component.adcode),
    cityCode: safeText(component.citycode),
    street: safeText(streetNumber.street),
    streetNumber: safeText(streetNumber.number),
    streetLocation: safeText(streetNumber.location),
    neighborhoodName: safeText(neighborhood.name),
    buildingName: safeText(building.name),
    poiName: safeText(firstPoi.name),
    poiDistance: safeText(firstPoi.distance),
    poiAddress: safeText(firstPoi.address),
    roadName: safeText(firstRoad.name),
    roadDistance: safeText(firstRoad.distance)
  }
}

export function normalizeLocationSnapshot(locationData, addressInfo) {
  var normalizedAddress = addressInfo || {}
  var formattedAddress = normalizedAddress.formattedAddress || buildFallbackAddress(normalizedAddress)

  return {
    latitude: safeNumber(locationData.latitude),
    longitude: safeNumber(locationData.longitude),
    accuracy: safeNumber(locationData.accuracy || locationData.horizontalAccuracy),
    horizontalAccuracy: safeNumber(locationData.horizontalAccuracy || locationData.accuracy),
    verticalAccuracy: safeNumber(locationData.verticalAccuracy),
    altitude: safeNumber(locationData.altitude),
    speed: safeNumber(locationData.speed),
    formattedAddress: formattedAddress,
    province: normalizedAddress.province || '',
    city: normalizedAddress.city || '',
    district: normalizedAddress.district || '',
    township: normalizedAddress.township || '',
    street: normalizedAddress.street || '',
    streetNumber: normalizedAddress.streetNumber || '',
    neighborhoodName: normalizedAddress.neighborhoodName || '',
    buildingName: normalizedAddress.buildingName || '',
    poiName: normalizedAddress.poiName || '',
    poiDistance: normalizedAddress.poiDistance || '',
    poiAddress: normalizedAddress.poiAddress || '',
    roadName: normalizedAddress.roadName || '',
    roadDistance: normalizedAddress.roadDistance || '',
    adcode: normalizedAddress.adcode || '',
    cityCode: normalizedAddress.cityCode || '',
    locatedAt: new Date().toISOString()
  }
}

export function getStoredLocationState() {
  return getStorageSync(LOCATION_STORAGE_KEY, null)
}

export function isAutoLocationEnabled() {
  return !!getStorageSync(AUTO_LOCATION_KEY, false)
}

export function setAutoLocationEnabled(value) {
  setStorageSync(AUTO_LOCATION_KEY, !!value)
}

export function hasRequestedInitialLocation() {
  return !!getStorageSync(INITIAL_LOCATION_REQUESTED_KEY, false)
}

export function setInitialLocationRequested(value) {
  setStorageSync(INITIAL_LOCATION_REQUESTED_KEY, !!value)
}

export function getLastAutoLocateAt() {
  return safeNumber(getStorageSync(LAST_AUTO_LOCATE_AT_KEY, 0))
}

export function saveLocationState(locationState) {
  setStorageSync(LOCATION_STORAGE_KEY, locationState)
  return locationState
}

export function formatLocationSummary(locationState) {
  if (!locationState) {
    return '暂无定位结果'
  }
  var address = safeText(locationState.formattedAddress)
  if (address) {
    return address
  }
  return trimCoordinate(locationState.longitude) + ', ' + trimCoordinate(locationState.latitude)
}

export function requestLocationCoordinates() {
  return new Promise(function (resolve, reject) {
    var locationType = (typeof uni.getSystemInfoSync === 'function') ? (() => {
      try {
        var sysInfo = uni.getSystemInfoSync()
        if (sysInfo.platform === 'android' || sysInfo.platform === 'ios') {
          return 'gcj02'
        }
      } catch (e) {}
      return 'wgs84'
    })() : 'wgs84'

    uni.getLocation({
      type: locationType,
      isHighAccuracy: true,
      highAccuracyExpireTime: 5000,
      geocode: false,
      success: function (result) {
        resolve(result)
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}

export function reverseGeocodeByAmap(longitude, latitude) {
  return new Promise(function (resolve, reject) {
    uni.request({
      url: buildAmapRegeoUrl(longitude, latitude),
      method: 'GET',
      success: function (response) {
        try {
          resolve(parseAmapRegeoResponse(response.data || {}))
        } catch (error) {
          reject(error)
        }
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}

export async function locatePrecisely(options) {
  var settings = options || {}
  var coordinates = await requestLocationCoordinates()
  var addressInfo = {}

  try {
    addressInfo = await reverseGeocodeByAmap(coordinates.longitude, coordinates.latitude)
  } catch (error) {
    addressInfo = {}
  }

  var snapshot = normalizeLocationSnapshot(coordinates, addressInfo)
  saveLocationState(snapshot)
  if (settings.enableAutoOnSuccess !== false) {
    setAutoLocationEnabled(true)
  }
  setInitialLocationRequested(true)
  setStorageSync(LAST_AUTO_LOCATE_AT_KEY, Date.now())
  return snapshot
}

export async function runAutoLocation(forceRefresh) {
  if (typeof uni === 'undefined') {
    return null
  }

  var shouldAutoLocate = isAutoLocationEnabled()
  var hasRequested = hasRequestedInitialLocation()
  var now = Date.now()
  var lastRunAt = getLastAutoLocateAt()

  if (!forceRefresh && lastRunAt && now - lastRunAt < AUTO_LOCATE_INTERVAL_MS) {
    return getStoredLocationState()
  }

  if (!shouldAutoLocate && hasRequested) {
    return getStoredLocationState()
  }

  if (!shouldAutoLocate && !hasRequested) {
    setInitialLocationRequested(true)
  }

  try {
    return await locatePrecisely({ enableAutoOnSuccess: true })
  } catch (error) {
    if (isPermissionDeniedError(error)) {
      setAutoLocationEnabled(false)
    }
    return getStoredLocationState()
  }
}

export async function requestPreciseLocationManually() {
  try {
    return await locatePrecisely({ enableAutoOnSuccess: true })
  } catch (error) {
    if (isPermissionDeniedError(error)) {
      setAutoLocationEnabled(false)
      setInitialLocationRequested(true)
      throw new Error('请允许定位权限后重试')
    }
    throw new Error(safeText(error && error.errMsg ? error.errMsg : error) || '定位失败，请稍后重试')
  }
}
