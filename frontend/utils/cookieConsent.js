// Согласие посетителя на аналитические и рекламные cookie (GDPR): выбор хранится в браузере,
// а плагины аналитики узнают о нём из события COOKIE_CONSENT_EVENT
const STORAGE_KEY = 'cookie-consent'

export const COOKIE_CONSENT_EVENT = 'cookie-consent'

// Метки клика по рекламе Google в адресе страницы
const AD_CLICK_PARAMS = ['gclid', 'gbraid', 'wbraid']

/**
 * Страница, на которой нужны аналитика и реклама: посадочная страница или любая страница,
 * открытая из объявления (дополнительные ссылки ведут на портфолио, отзывы и контакты)
 * @param {import('vue-router').RouteLocationNormalized} route
 * @returns {boolean}
 */
export function isTrackedRoute (route) {
  const name = String(route.name ?? '')
  return name === 'landing' || name.startsWith('landing___')
    || AD_CLICK_PARAMS.some(param => param in route.query)
}

/**
 * Сохранённый выбор посетителя
 * @returns {'granted'|'denied'|null} null — посетитель ещё не выбирал
 */
export function readCookieConsent () {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  }
  catch {
    return null
  }
}

/**
 * Сохраняет выбор и сообщает о нём плагинам аналитики
 * @param {'granted'|'denied'} value
 */
export function saveCookieConsent (value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  }
  catch {
    // Хранилище недоступно (приватный режим): выбор действует до перезагрузки страницы
  }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }))
}

/**
 * Вызывает callback, когда посетитель дал согласие: сразу, если оно уже сохранено, иначе — после выбора
 * @param {() => void} callback
 */
export function onCookieConsentGranted (callback) {
  if (readCookieConsent() === 'granted') {
    callback()
    return
  }
  window.addEventListener(COOKIE_CONSENT_EVENT, (event) => {
    if (event.detail === 'granted') callback()
  })
}
