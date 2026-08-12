export default {
  // Полностью управляем составом карты сайта: автообнаружение маршрутов Nuxt
  // добавляло адреса без префикса локали (/portfolio, /posts), которые редиректят
  excludeAppSources: true,
  exclude: [
    '/card',
    '/donate',
  ],
  sources: [
    '/api/__sitemap__/urls',
  ],
}
