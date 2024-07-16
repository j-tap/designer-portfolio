<template>
  <div class="page-reviews info-section">
    <TitleOutline class="page-reviews__title">{{ title }}</TitleOutline>

    <div class="page-reviews__wrap">
      <ReviewsList
        :items="reviews"
        class="page-reviews__list"
      />
      <div ref="elForm" :style="elFormStyle" class="page-reviews__form-wrap">
        <h2
          :class="['page-reviews__form-title', { 'page-reviews__form-title_active': isDisplayForm }]"
          @click="toggleForm"
        >
          Оставить отзыв
        </h2>
        <div :class="['page-reviews__form', { 'page-reviews__form_show': isDisplayForm }]">
          <ReviewForm
            v-if="canSendReview"
            :form="form"
            :data="data"
            @send="sendForm"
          />
          <div v-else class="page-reviews__form-success">
            <h3>Спасибо, что оставили отзыв!</h3>
            <p>Ваш отзыв будет опубликован в ближайшее время.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: decompose component
import { TitleOutline } from '~/components/common'
import { ReviewsList, ReviewForm } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch, serverCreate } from '~/composables/useApi'
import { useReviewsStore } from '~/stores/reviewsStore'
import { useMedia } from '~/composables/useMedia'

const { t } = useI18n()
const mdDown = useMedia('md-down')
const reviewsStore = useReviewsStore()
const title = ref(t('menu.reviews'))
const reviewsData = serverFetch('reviews', {
  sort: [{ createdAt: 'desc' }],
}, [])
const reviews = computed(() => reviewsData.value)
const developmentsData = serverFetch('reviews-developments')
const cooperationsData = serverFetch('reviews-cooperations')
const data = computed(() => ({
  developments: developmentsData.value,
  cooperations: cooperationsData.value,
}))
const canSendReview = computed(() => reviewsStore.getCanSendReview)
const isDisplayForm = ref(!mdDown.value)

const elForm = ref(null)
const offsetBottom = ref(0)
const elFormStyle = computed(() => ({
  transform: `translateY(${offsetBottom.value}px)`
}))

const form = reactive({
  name: null,
  company: null,
  link: null,
  rating: 5,
  review: null,
  developments: [],
  cooperations: [],
  text: null,
  files: [],
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})

function toggleForm () {
  isDisplayForm.value = !isDisplayForm.value
}

function handleScroll () {
  if (mdDown.value) {
    offsetBottom.value = 0
  }
  else {
    const windowHeight = window.innerHeight
    const blockHeight = elForm.value.offsetHeight + elForm.value.offsetTop
    const scrollY = window.scrollY + windowHeight

    offsetBottom.value = scrollY > blockHeight ? offsetBottom.value = scrollY - blockHeight : 0
  }
}

async function sendForm (form) {
  const data = {}
  const formData = new FormData()

  Object.keys(form).forEach(key => {
    if (!['files'].includes(key)) {
      data[key] = form[key]
    }
    else if (key === 'files') {
      form.files.forEach(file => {
        formData.append(`files.${key}`, file, file.name)
      })
    }
  })

  formData.append('data', JSON.stringify(data))

  const { ok } = await serverCreate('reviews', formData)

  if (ok) {
    reviewsStore.setCanSendReview(false)
  }
}

useHead(metaInfo({ title }))
</script>

<style lang="scss" scoped src="./style.scss"/>
