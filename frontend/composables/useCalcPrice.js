import { useMetaStore } from '~/stores/metaStore'
import { datesDiff, getWeekendsDays } from '~/utils/formatDate'

const HOURS_DAY = 8
let RATE = 1

export function getHours (time = {}) {
  if (time.hours || (time.start && time.end)) {
    if (time.hours) {
      return time.hours
    } else {
      const weekends = getWeekendsDays(time.start, time.end)
      const days = datesDiff(time.start, time.end, 'd')

      return (days - weekends.length) * HOURS_DAY
    }
  }

  return 0
}

export function getPrice (timeHours) {
  const metaStore = useMetaStore()
  RATE = metaStore.pay_rate

  return timeHours * RATE
}
