// Оформление посадочных страниц, которое проще держать здесь, чем заполнять в Strapi.
// В портфолио и в разделе «Отзывы» всё остаётся как в Strapi

// Обложки проектов в разделе «Проекты» по slug проекта: экраны проекта на устройствах,
// текст на экранах — на языке страницы (на других языках — английский).
// Файлы в public/landing: <slug>-<язык>.webp и уменьшенная копия <slug>-<язык>-640.webp
const COVER_SIZE = { width: 1152, height: 896 }
const coverSlugs = ['bizteka', 'reab', 'vr-logistic']
const coverLocales = ['es', 'en', 'ru']

export function landingCover (slug, locale) {
  if (!coverSlugs.includes(slug)) return null
  const name = `/landing/${slug}-${coverLocales.includes(locale) ? locale : 'en'}`
  return {
    src: `${name}.webp`,
    srcset: `${name}-640.webp 640w, ${name}.webp ${COVER_SIZE.width}w`,
    ...COVER_SIZE,
  }
}

// Отзывы в разделе «Отзывы»: сначала эти, в этом порядке, остальные — после них, от новых к старым.
// Отзыв узнаётся по адресу сайта компании (link). quote — короткая цитата крупно над текстом,
// company — название компании на странице (по языку; без языка — как в Strapi)
export const landingReviews = [
  {
    site: 'ptt-rec.com',
    quote: {
      es: 'Creó un prototipo que se adaptó perfectamente a lo que buscaba. Al final, me encantó el resultado.',
      en: 'She created a prototype that was exactly what I was looking for. In the end, I love the result.',
      ru: 'Она сделала прототип, который мне подошёл. В итоге сайт мне нравится.',
    },
  },
  {
    site: 'vr-logistic.ru',
    quote: {
      es: 'No se limitó a crear el diseño visual: mantuvo siempre el foco en el resultado final y la facilidad de uso.',
      en: 'She didn’t just draw the design: she always kept the end result and ease of use in focus.',
      ru: 'Она не просто «рисовала дизайн», а полностью держала в фокусе конечный результат и удобство для пользователя.',
    },
  },
  {
    site: 'mc-semya.ru',
    quote: {
      es: 'El sitio quedó funcional, visualmente impecable y fácil de entender para los pacientes.',
      en: 'The website turned out functional, visually polished and easy for patients to understand.',
      ru: 'Сайт получился функциональным, визуально аккуратным и понятным для пациентов.',
    },
    company: {
      es: 'Centro Médico Semya',
      en: 'Semya Medical Center',
    },
  },
]
