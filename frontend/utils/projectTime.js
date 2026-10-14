import { datesDiff, getWeekendsDays } from './formatDate.js'

const HOURS_DAY = 8

/**
 * Часы работы над проектом: заданные вручную или рабочие дни между датами по 8 часов.
 */
export function getHours (time = {}) {
  if (time.hours) return time.hours
  if (!time.start || !time.end) return 0

  const weekends = getWeekendsDays(time.start, time.end)
  const days = datesDiff(time.start, time.end, 'd')
  return (days - weekends.length) * HOURS_DAY
}

/**
 * Стоимость по часовой ставке (pay_rate из мета-информации).
 */
export function getPrice (hours, rate) {
  return hours * (rate || 0)
}
