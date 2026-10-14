const PLACEHOLDER = /\{\s*years\s*\}/g

// То же значение, что default у career_start_year в схеме meta-info: у записи, созданной
// до появления поля, оно пустое, пока его не сохранят в админке
const DEFAULT_START_YEAR = 2019

/**
 * Сколько лет опыта на текущий момент, считая от года начала карьеры (поле career_start_year).
 *
 * @param {number} startYear
 * @param {Date} now
 * @return {number|null}
 */
export function experienceYears (startYear, now = new Date()) {
  const year = Number(startYear ?? DEFAULT_START_YEAR)
  if (!Number.isInteger(year) || year <= 0) return null
  return Math.max(now.getFullYear() - year, 0)
}

/**
 * Подставляет стаж вместо {years} в тексте из Strapi, чтобы число не приходилось
 * обновлять вручную каждый год. Например, «более {years} лет опыта» → «более 7 лет опыта».
 * Если год начала не заполнен, берётся значение по умолчанию.
 *
 * @param {string} text
 * @param {number} startYear
 * @return {string}
 */
export function fillExperience (text, startYear) {
  if (typeof text !== 'string') return text
  const years = experienceYears(startYear)
  return years === null ? text : text.replace(PLACEHOLDER, String(years))
}
