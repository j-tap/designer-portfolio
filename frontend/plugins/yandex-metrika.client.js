// Яндекс Метрика: только в браузере (.client), только с номером счётчика (YANDEX_METRIKA_ID),
// только на посадочной странице или после перехода из объявления (useTrackingActive)
// и только после согласия посетителя на cookie (баннер CookieBanner)
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  if (!config.public.yandexMetrikaId || import.meta.dev) return

  let started = false

  function load () {
    ;(function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){
        (m[i].a=m[i].a||[]).push(arguments)
      };
      m[i].l=1*new Date()
      k=e.createElement(t), a=e.getElementsByTagName(t)[0], k.async=1, k.src=r, a.parentNode.insertBefore(k,a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')
    ym(config.public.yandexMetrikaId, 'init', {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      trackHash:true
    })
  }

  const active = useTrackingActive()
  watch(active, (value) => {
    if (value && !started) {
      started = true
      onCookieConsentGranted(load)
    }
  }, { immediate: true })
})
