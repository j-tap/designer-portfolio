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

export function dateFormat (d) {
  const i18n = useI18n()
  const date = new Date(d)
  const options = { day: 'numeric', month: 'long' }

  return new Intl
    .DateTimeFormat(i18n.locale.value, options)
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