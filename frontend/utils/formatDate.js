export function datesDiff (startDate, endDate, unit) {
  let result = 0

  if (!Date.parse(startDate) || !Date.parse(endDate)) {
    return result
  }

  const diff = new Date(startDate).getTime() - new Date(endDate).getTime()
  const ms = 1000

  if (unit === 'm') {
    result = diff / (ms * 60)
  } else if (unit === 'h') {
    result = diff / (ms * 3600)
  } else if (unit === 'd') {
    result = diff / (ms * 3600 * 24)
  } else if (unit === 's') {
    result = diff / ms
  } else {
    result = diff
  }

  return Math.abs(Math.ceil(result))
}

export function dateFormat (d, options = {}, locale = 'ru') {
  const date = new Date(d)
  const opt = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    ...options,
  }

  return new Intl
    .DateTimeFormat(locale, opt)
    .format(date)
}

export function getWeekendsDays (startDate, endDate) {
  const results = []
  const end = new Date(endDate)

  for (let start = new Date(startDate); start <= end; start.setDate(start.getDate() + 1)) {
    const day = start.getDay()

    if (day === 6 || day === 0) {
      results.push(new Date(start))
    }
  }

  return results
}

/**
 * Форматирует относительную дату на основе данных из API
 * @param {Object} dateData - Объект с полями value, unit, raw
 * @param {Function} t - Функция перевода i18n
 * @returns {string} Отформатированная дата
 */
export function formatRelativeDate (dateData, t) {
  if (!dateData || typeof dateData.value !== 'number' || !dateData.unit) {
    return dateData?.raw || ''
  }

  const value = dateData.value
  const unit = dateData.unit.toLowerCase()

  const unitMap = {
    'minute': 'common.minute',
    'minutes': 'common.minute',
    'hour': 'common.hour',
    'hours': 'common.hour',
    'day': 'common.day',
    'days': 'common.day',
    'week': 'common.week',
    'weeks': 'common.week',
    'month': 'common.month',
    'months': 'common.month',
    'year': 'common.year',
    'years': 'common.year',
  }

  const translationKey = unitMap[unit]

  if (!translationKey) {
    return dateData.raw || ''
  }

  const translated = t(translationKey, value)
  const ago = t('common.ago')
  
  return `${value} ${translated} ${ago}`
}