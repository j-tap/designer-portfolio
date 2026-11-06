// Microsoft Clarity (записи визитов и карта прокрутки): только в браузере (.client), только с номером
// проекта (CLARITY_ID), только на посадочной странице или после перехода из объявления (useTrackingActive)
// и только после согласия на cookie там, где оно нужно (Европа, см. consentRequired и баннер CookieBanner)
export default defineNuxtPlugin(() => {
  const { clarityId } = useRuntimeConfig().public
  if (!clarityId || import.meta.dev) return

  let started = false

  function load () {
    ;(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, 'clarity', 'script', clarityId)
    // Для посетителей из Европы Clarity без этого сигнала работает без cookie и не склеивает страницы
    // в один визит. Рекламное хранилище запрещаем: данные в Microsoft Ads нам не нужны
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' })
  }

  const active = useTrackingActive()
  watch(active, (value) => {
    if (value && !started) {
      started = true
      onCookieConsentGranted(load)
    }
  }, { immediate: true })
})
