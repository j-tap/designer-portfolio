// Тег Google Рекламы: только в браузере (.client), только с номером аккаунта (GOOGLE_ADS_ID)
// и только на посадочной странице или после перехода из объявления (useTrackingActive).
// $trackContactConversion отправляет конверсию «Контакты» — без GOOGLE_ADS_CONTACT_LABEL ничего не делает.
// Клик по ссылке WhatsApp, Telegram, почты или телефона — отдельная конверсия (GOOGLE_ADS_CONTACT_CLICK_LABEL)

// Ссылки, по которым посетитель пишет или звонит: почта, телефон, WhatsApp, Telegram
const CONTACT_LINK = /^(mailto:|tel:)|wa\.me|whatsapp\.com|t\.me\//i

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { googleAdsId, googleAdsContactLabel, googleAdsContactClickLabel } = config.public
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
      // Тег ждёт ответа из баннера, прежде чем отправлять первые данные
      wait_for_update: 500,
    })

    // До config: если посетитель уже соглашался раньше, первый же визит уходит в Google с согласием
    onCookieConsentGranted(() => {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      })
    })

    window.gtag('js', new Date())
    window.gtag('config', googleAdsId)

    if (googleAdsContactClickLabel) {
      document.addEventListener('click', (event) => {
        const link = event.target.closest?.('a[href]')
        if (link && CONTACT_LINK.test(link.getAttribute('href'))) {
          window.gtag('event', 'conversion', { send_to: `${googleAdsId}/${googleAdsContactClickLabel}` })
        }
      })
    }
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
