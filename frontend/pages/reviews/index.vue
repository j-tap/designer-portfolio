<template>
  <div class="page-reviews info-section">
    <TitleOutline class="page-reviews__title">{{ title }}</TitleOutline>

    <div class="page-reviews__wrap">
      <ReviewsList
        :items="reviews"
        class="page-reviews__list"
      />
      <ReviewForm
        v-if="canSendReview"
        :form="form"
        :data="data"
        class="page-reviews__form"
        @send="sendForm"
      />
      <p v-else>Спасибо, что оставили отзыв</p>
    </div>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ReviewsList, ReviewForm } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch, serverCreate } from '~/composables/useApi'
import { useReviewsStore } from '~/stores/reviewsStore'
// import { useMetaStore } from '~/stores/metaStore'

const { t } = useI18n()
const reviewsStore = useReviewsStore()
// const metaStore = useMetaStore()
const title = ref(t('menu.reviews'))
// const meta = computed(() => metaStore.getMetaInfo)
const reviewsData = serverFetch('reviews', {}, [])
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
  console.log('form', form)
  const formData = new FormData()
  // const fields = Object.keys(form).filter(s => s !== 'files')
  // fields.forEach(field => {
  //   formData.append(field, form[field])
  // })

  const { files } = form
  const newForm = { ...form }
  delete newForm.files

  formData.append('data', JSON.stringify(newForm))
  files.forEach(file => {
    formData.append('files', file)
  })
  console.log('formData', formData)
  const { data } = await serverCreate('reviews', formData)
  console.log('resp data', data)
  if (data?.id) {
    reviewsStore.setCanSendReview(false)
  }
}

useHead(metaInfo({ title }))
</script>

<style lang="scss" scoped src="./style.scss"/>
