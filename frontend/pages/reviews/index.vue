<template>
  <div class="page-reviews info-section">
    <TitleOutline class="page-reviews__title">{{ title }}</TitleOutline>

    <div class="page-reviews__wrap">
      <ReviewsList
        :items="reviews"
        class="page-reviews__list"
      />
      <div class="page-reviews__form">
        <ReviewForm
          v-if="canSendReview"
          :form="form"
          :data="data"
          @send="sendForm"
        />
        <h3 v-else>Спасибо, что оставили отзыв</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ReviewsList, ReviewForm } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch, serverCreate } from '~/composables/useApi'
import { useReviewsStore } from '~/stores/reviewsStore'

const { t } = useI18n()
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

const form = reactive({
  name: null,
  company: null,
  link: null,
  rating: 5,
  review: null,
  development: '',
  cooperation: '',
  text: null,
  files: [],
})

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
