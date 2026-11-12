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
      <template v-for="(section, index) in sections" :key="`${section.__component}-${section.id}`">
        <Component
          :is="sectionComponents[section.__component]"
          :id="sectionIds[index]"
          :section="section"
          :items="section.__component === 'landing.section-cases' ? casesItems(section) : undefined"
          :class="['page-landing__section', `page-landing__section_${section.__component.split('-').pop()}`]"
        />
        <LandingCta
          v-if="index === ctaAfterIndex"
          class="page-landing__section page-landing__section_cta"
          :label="contactLabel"
          :whatsapp-href="whatsappHref"
        />
      </template>
    </div>

    <LandingWhatsappFloat
      v-if="whatsappHref"
      :href="whatsappHref"
      :label="contactSection?.whatsapp_label"
    />

    <!-- Одно окно с формой на страницу: его открывают кнопки первого экрана, середины и контактов -->
    <ModalBase v-model="formOpen" :title="contactLabel" wide>
      <ContactForm :whatsapp-href="whatsappHref" />
    </ModalBase>

    <!-- Проект из раздела «Проекты» — в окне поверх посадочной, а не переходом в портфолио -->
    <ModalBase v-model="previewOpen" :label="previewTitle" large>
      <LandingProject
        v-if="previewOpen"
        :key="preview.slug.value"
        :slug="preview.slug.value"
        :contact-label="contactLabel"
        @contact="contactFromPreview"
      />
    </ModalBase>
  </div>
</template>

<script setup>
import { ModalBase, TranslationNotice } from '~/components/common'
import { ContactForm, LandingCards, LandingCases, LandingContact, LandingCta, LandingFaq, LandingHero, LandingProject, LandingReviews, LandingWhatsappFloat } from '~/components/sections'
import { landingCover } from '~/config/landing'
import { projectPaths } from '~/config/portfolio'
import { fillExperienceDeep } from '~/utils/experience'

// Посадочные страницы («Посадочные страницы» в Strapi): /<язык>/<slug>.
// Отдельные страницы (/contacts, /portfolio…) Nuxt выбирает раньше этого адреса.
// Без перевода на язык адреса показывается оригинал, canonical ведёт на него (app.vue).
// Языковые версии (hreflang, переключатель языков) сообщает middleware/landing.js
definePageMeta({ middleware: 'landing', preloader: false })

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

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const siteMeta = useSiteMeta()
const absoluteUrl = useAbsoluteUrl()
const contentLang = useContentLang()
const { mediaUrl, mediaSrcset } = useMedia()

const { data: landingData } = await useRequiredStrapiData('landings', {
  filters: { slug: { $eq: route.params.landing } },
}, { single: true })

// Стаж в текстах пишется как {years} и считается от года начала карьеры (meta-info)
const landing = computed(() => fillExperienceDeep(landingData.value, siteMeta.value.careerStartYear))

// Пустой раздел (без компонента на сайте) не выводим
// Блок отзывов подставляется сам (после проектов), если его не добавили в Strapi
const sections = computed(() => {
  const list = (landing.value.sections ?? []).filter(section => sectionComponents[section.__component])
  if (list.some(section => section.__component === 'landing.section-reviews')) return list

  const auto = { __component: 'landing.section-reviews', id: 'auto', title: t('landing.reviews_title'), limit: 3 }
  const casesIndex = list.findLastIndex(section => section.__component === 'landing.section-cases')
  const contactIndex = list.findIndex(section => section.__component === 'landing.section-contact')
  const at = casesIndex !== -1 ? casesIndex + 1 : contactIndex !== -1 ? contactIndex : list.length
  return [...list.slice(0, at), auto, ...list.slice(at)]
})

// Призыв связаться посреди страницы: после отзывов (иначе после проектов), если ниже есть блок контактов
const contactSection = computed(() => sections.value.find(section => section.__component === 'landing.section-contact'))

const ctaAfterIndex = computed(() => {
  const types = sections.value.map(section => section.__component)
  const after = [types.lastIndexOf('landing.section-reviews'), types.lastIndexOf('landing.section-cases')].find(i => i !== -1) ?? -1
  return after !== -1 && after < types.indexOf('landing.section-contact') - 1 ? after : -1
})

const whatsappHref = useWhatsappLink(() => contactSection.value?.whatsapp_message)

// Состояние окна общее для всего приложения: уходя со страницы, закрываем его,
// чтобы на другой посадочной оно не открылось само
const formOpen = useContactFormOpen()
onBeforeUnmount(() => {
  formOpen.value = false
})

const contactLabel = computed(() => contactSection.value?.cta_label || t('contact_form.title'))

// Предпросмотр проекта: открытый проект — в адресе (?project=). Окно показывается только
// в браузере: открыть его сразу при серверном рендере Teleport в body не даст
const preview = useProjectPreview()
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const previewOpen = computed({
  get: () => mounted.value && Boolean(preview.slug.value),
  set: (value) => {
    if (!value) preview.close()
  },
})

const previewTitle = computed(() => sections.value
  .filter(section => section.__component === 'landing.section-cases')
  .flatMap(section => section.items ?? [])
  .find(item => item.project_slug?.trim() === preview.slug.value)?.title ?? null)

// «Обсудить проект» в конце предпросмотра: окно проекта закрывается, открывается форма.
// Форму открываем, когда окно проекта уже закрылось (адрес меняется не сразу): иначе оно,
// закрываясь, сняло бы блокировку прокрутки страницы под формой
function contactFromPreview () {
  const stop = watch(previewOpen, (open) => {
    if (open) return
    stop()
    formOpen.value = true
  })
  preview.close()
}

const anchors = computed(() => Object.fromEntries(Object.entries(ANCHORS)
  .map(([anchor, type]) => [anchor, sections.value.some(section => section.__component === type) ? anchor : null])))

const sectionIds = computed(() => sections.value.map((section, index) => {
  const anchor = Object.keys(ANCHORS).find(key => ANCHORS[key] === section.__component)
  const isFirst = sections.value.findIndex(item => item.__component === section.__component) === index
  return anchor && isFirst ? anchor : undefined
}))

// Обложки и адреса проектов из раздела «Проекты». Проекты могут быть не переведены на язык
// страницы — тогда берётся оригинал: нужны только обложка и slug.
// Обложка посадочной (config/landing.js) важнее обложки из портфолио
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
    const slug = item.project_slug?.trim()
    const project = projects.value.find(project => project.slug === slug)
    const [path] = project ? projectPaths(project) : []
    return { ...item, image: landingCover(slug, locale.value) ?? previewImage(project?.preview), to: path ? localePath(path) : null }
  })
}

function previewImage (file) {
  if (!file) return null
  const { url, width, height, blurhash } = file
  return { src: mediaUrl(url), srcset: mediaSrcset(file), width, height, blurhash }
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
