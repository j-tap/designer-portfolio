// Яндекс Метрика: только в браузере (.client) и только с номером счётчика (YANDEX_METRIKA_ID)
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  if (config.public.yandexMetrikaId && !import.meta.dev) {
    (function(m,e,t,r,i,k,a){
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
})
