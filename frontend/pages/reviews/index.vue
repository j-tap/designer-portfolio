<template>
  <div class="page-reviews info-section">
    <TitleOutline class="page-reviews__title">{{ title }}</TitleOutline>

    <div class="page-reviews__wrap">
      <ReviewsList
        :items="reviews"
        class="page-reviews__list"
      />
      <div ref="formWrap" :style="elFormStyle" class="page-reviews__form-wrap">
        <h2
          :class="['page-reviews__form-title', { 'page-reviews__form-title_active': isFormOpen }]"
          @click="isFormOpen = !isFormOpen"
        >
          {{ t('reviews.form_title') }}
        </h2>
        <div :class="['page-reviews__form', { 'page-reviews__form_show': isFormOpen }]">
          <ReviewForm
            v-if="canSendReview"
            :form="form"
            :data="{ developments, cooperations }"
            :error="formError"
            :sending="sending"
            @send="sendForm"
          />
          <div v-else class="page-reviews__form-success">
            <h3>{{ t('reviews.success_title') }}</h3>
            <p>{{ t('reviews.success_text') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEventListener, useLocalStorage, useMediaQuery } from '@vueuse/core'
import { TitleOutline } from '~/components/common'
import { ReviewsList, ReviewForm } from '~/components/sections'

const { t, locale } = useI18n()
const client = useStrapiClient()
const title = computed(() => t('menu.reviews'))

const { data: reviews } = await useRequiredStrapiData('reviews', { sort: [{ createdAt: 'desc' }] }, { allowMissing: true })
// Варианты ответа формы — только на языке страницы: отзыв сохраняется на этом языке
// и ссылается на их версии на нём же
const { data: developments } = useStrapiData('reviews-developments', {}, { fallback: false })
const { data: cooperations } = useStrapiData('reviews-cooperations', {}, { fallback: false })

// Отзыв уже отправлен с этого браузера — вместо формы благодарность.
// Значение читается после монтирования, чтобы разметка совпала с серверной
const canSendReview = useLocalStorage('canSendReview', true, { initOnMounted: true })

// На узких экранах форма свёрнута под заголовком, на широких открыта и едет вместе с прокруткой
const isNarrow = useMediaQuery('(max-width: 1023.98px)')
const isFormOpen = ref(true)
watch(isNarrow, (narrow) => {
  isFormOpen.value = !narrow
})

const formWrap = useTemplateRef('formWrap')
const offsetBottom = ref(0)
const elFormStyle = computed(() => ({
  transform: `translateY(${offsetBottom.value}px)`,
}))

function followScroll () {
  if (isNarrow.value || !formWrap.value) {
    offsetBottom.value = 0
    return
  }
  const formBottom = formWrap.value.offsetHeight + formWrap.value.offsetTop
  const viewportBottom = window.scrollY + window.innerHeight
  offsetBottom.value = Math.max(viewportBottom - formBottom, 0)
}

useEventListener('scroll', followScroll, { passive: true })
useEventListener('resize', followScroll, { passive: true })

const form = reactive({
  name: null,
  company: null,
  link: null,
  rating: 5,
  developments: [],
  cooperations: [],
  text: null,
  files: [],
  website: '',
})
const formToken = ref(null)
const formError = ref(null)
const sending = ref(false)

// Токен выдаётся сервером при открытии формы: без него отзыв не примут (защита от ботов)
async function loadFormToken () {
  try {
    formToken.value = (await client('/reviews/form-token')).token
  }
  catch (error) {
    console.error('Error loading review form token:', error)
  }
}

onMounted(() => {
  loadFormToken()
  followScroll()
})

async function sendForm ({ files, ...fields }) {
  // Язык нужен, чтобы связать отзыв с направлениями на том языке, который видел автор
  const formData = new FormData()
  formData.append('data', JSON.stringify({ ...fields, formToken: formToken.value, locale: locale.value }))
  files.forEach(file => formData.append('files.files', file, file.name))

  sending.value = true
  formError.value = null

  try {
    await client('/reviews', { method: 'POST', body: formData })
    canSendReview.value = false
  }
  catch (error) {
    formError.value = error?.error?.message || t('reviews.send_error')
    // Токен мог устареть: берём новый, чтобы повторная отправка прошла
    loadFormToken()
  }
  finally {
    sending.value = false
  }
}

usePageMeta({ title })
</script>

<style lang="scss" scoped src="./style.scss"/>
