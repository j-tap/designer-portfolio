import { fillExperience } from '~/utils/experience'

/**
 * Общие данные сайта из Strapi (одиночный тип «Мета информация»): заголовок и описание по умолчанию,
 * автор, ставка, год начала карьеры. Запрос один на страницу: все вызовы делят данные по ключу
 * useAsyncData, а app.vue дожидается их до рендера.
 */
export function useSiteMeta () {
  const { data } = useStrapiData('meta-info', { populate: { image: true } }, { singleType: true })

  return computed(() => {
    const meta = data.value || {}
    return {
      title: meta.title || null,
      description: fillExperience(meta.description, meta.career_start_year) || null,
      keywords: meta.keywords || null,
      image: meta.image?.url || null,
      author: meta.author || null,
      payRate: meta.pay_rate || 0,
      careerStartYear: meta.career_start_year || null,
      firstName: meta.first_name || null,
      lastName: meta.last_name || null,
      specialization: meta.specialization || null,
    }
  })
}

/**
 * Название сайта для заголовков, соцсетей и JSON-LD: из переводов, иначе заголовок из Strapi.
 */
export function useSiteName () {
  const { t } = useI18n()
  const siteMeta = useSiteMeta()
  return computed(() => t('app.name') || siteMeta.value.title || 'Portfolio')
}
