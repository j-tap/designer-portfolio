<template>
  <div class="page-landing" :lang="contentLang(landing)">
    <LandingHero
      :title="landing.title"
      :title-accent="landing.title_accent"
      :hero="landing.hero"
      :contact-href="anchors.contact && `#${anchors.contact}`"
      :projects-href="anchors.projects && `#${anchors.projects}`"
    >
      <TranslationNotice :locale="landing.locale" />
    </LandingHero>

    <div class="page-landing__sections">
      <Component
        :is="sectionComponents[section.__component]"
        v-for="(section, index) in sections"
        :id="sectionIds[index]"
        :key="`${section.__component}-${section.id}`"
        :section="section"
        :items="section.__component === 'landing.section-cases' ? casesItems(section) : undefined"
        :class="['page-landing__section', `page-landing__section_${section.__component.split('-').pop()}`]"
      />
    </div>
  </div>
</template>

<script setup>
import { TranslationNotice } from '~/components/common'
import { LandingCards, LandingCases, LandingContact, LandingFaq, LandingHero, LandingReviews } from '~/components/sections'
import { projectPaths } from '~/config/portfolio'

// Посадочные страницы («Посадочные страницы» в Strapi): /<язык>/<slug>.
// Отдельные страницы (/contacts, /portfolio…) Nuxt выбирает раньше этого адреса.
// Без перевода на язык адреса показывается оригинал, canonical ведёт на него (app.vue).
// Языковые версии (hreflang, переключатель языков) сообщает middleware/landing.js
definePageMeta({ middleware: 'landing' })

const sectionComponents = {
  'landing.section-cards': LandingCards,
  'landing.section-cases': LandingCases,
  'landing.section-faq': LandingFaq,
  'landing.section-reviews': LandingReviews,
  'landing.section-contact': LandingContact,
}

// Разделы, к которым ведут кнопки первого экрана: якорь у первого раздела этого типа
const ANCHORS = {
  projects: 'landing.section-cases',
  contact: 'landing.section-contact',
}

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const siteMeta = useSiteMeta()
const absoluteUrl = useAbsoluteUrl()
const contentLang = useContentLang()

const { data: landing } = await useRequiredStrapiData('landings', {
  filters: { slug: { $eq: route.params.landing } },
}, { single: true })

// Пустой раздел (без компонента на сайте) не выводим
const sections = computed(() => (landing.value.sections ?? []).filter(section => sectionComponents[section.__component]))

const anchors = computed(() => Object.fromEntries(Object.entries(ANCHORS)
  .map(([anchor, type]) => [anchor, sections.value.some(section => section.__component === type) ? anchor : null])))

const sectionIds = computed(() => sections.value.map((section, index) => {
  const anchor = Object.keys(ANCHORS).find(key => ANCHORS[key] === section.__component)
  const isFirst = sections.value.findIndex(item => item.__component === section.__component) === index
  return anchor && isFirst ? anchor : undefined
}))

// Обложки и адреса проектов из раздела «Проекты». Проекты могут быть не переведены на язык
// страницы — тогда берётся оригинал: нужны только обложка и slug
const caseSlugs = [...new Set(sections.value
  .filter(section => section.__component === 'landing.section-cases')
  .flatMap(section => section.items?.map(item => item.project_slug?.trim()) ?? [])
  .filter(Boolean))]

const { data: projects } = await useStrapiData('projects', {
  filters: { slug: { $in: caseSlugs } },
  fields: ['slug', 'locale'],
  populate: {
    preview: true,
    categories: { fields: ['slug'] },
    subcategories: { fields: ['slug'], populate: { category: { fields: ['slug'] } } },
  },
}, { default: () => [], immediate: caseSlugs.length > 0 })

function casesItems (section) {
  return (section.items ?? []).map((item) => {
    const project = projects.value.find(({ slug }) => slug === item.project_slug?.trim())
    const [path] = project ? projectPaths(project) : []
    return { ...item, preview: project?.preview ?? null, to: path ? localePath(path) : null }
  })
}

usePageMeta({
  title: () => landing.value.seo?.title || landing.value.title,
  exactTitle: () => Boolean(landing.value.seo?.title),
  description: () => landing.value.seo?.description || landing.value.hero?.lead,
  keywords: () => landing.value.seo?.keywords,
  image: () => landing.value.seo?.image?.url,
})

useStructuredData('website', {
  breadcrumbs: computed(() => [
    { name: t('menu.main'), url: '/' },
    { name: landing.value.title },
  ]),
})

// Услуга и вопросы с ответами — для расширенных сниппетов в выдаче
const authorName = computed(() => [siteMeta.value.firstName, siteMeta.value.lastName].filter(Boolean).join(' '))

useJsonLd(() => {
  const url = absoluteUrl(route.path)
  const faq = sections.value
    .filter(section => section.__component === 'landing.section-faq')
    .flatMap(section => section.items ?? [])
    .filter(item => item.question && item.answer)

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: landing.value.title,
      serviceType: landing.value.title,
      description: landing.value.seo?.description || landing.value.hero?.lead,
      url,
      inLanguage: landing.value.locale,
      provider: authorName.value
        ? {
            '@type': 'Person',
            name: authorName.value,
            jobTitle: siteMeta.value.specialization || undefined,
            url: absoluteUrl(localePath('/')),
          }
        : undefined,
    },
    faq.length && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      url,
      mainEntity: faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]
}, 'landing-data')
</script>

<style lang="scss" scoped src="./style.scss"/>
