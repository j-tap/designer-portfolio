// Тег Google Рекламы: только в браузере (.client), только с номером аккаунта (GOOGLE_ADS_ID)
// и только на посадочной странице или после перехода из объявления (useTrackingActive).
// $trackContactConversion отправляет конверсию «Контакты» — без GOOGLE_ADS_CONTACT_LABEL ничего не делает
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { googleAdsId, googleAdsContactLabel } = config.public
  const enabled = googleAdsId && !import.meta.dev
  let loaded = false

  function load () {
    loaded = true

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    // Режим согласия (Consent Mode v2) для посетителей из ЕЭЗ: пока посетитель не нажал «Принять»
    // в баннере cookie, всё запрещено — тег не ставит рекламные cookie и шлёт Google только
    // обезличенные сигналы, по которым тот моделирует конверсии
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    })
    window.gtag('js', new Date())
    window.gtag('config', googleAdsId)

    onCookieConsentGranted(() => {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      })
    })
  }

  if (enabled) {
    const active = useTrackingActive()
    watch(active, (value) => {
      if (value && !loaded) load()
    }, { immediate: true })
  }

  return {
    provide: {
      trackContactConversion () {
        if (loaded && googleAdsContactLabel) {
          window.gtag('event', 'conversion', { send_to: `${googleAdsId}/${googleAdsContactLabel}` })
        }
      },
    },
  }
})
