// Аналитика и реклама работают не на всём сайте, а только после того, как посетитель попал на
// посадочную страницу или пришёл из объявления (isTrackedRoute). Дальше по сайту они остаются
// включёнными: загруженные скрипты не выгрузить. Плагины тегов и баннер cookie следят за этим флагом
export default defineNuxtPlugin(() => {
  const active = useTrackingActive()
  const router = useRouter()

  const check = (route) => {
    if (!active.value && isTrackedRoute(route)) active.value = true
  }

  router.isReady().then(() => check(router.currentRoute.value))
  router.afterEach(to => check(to))
})
