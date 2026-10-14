<template>
  <form
    v-if="form"
    class="form review-form"
    @submit.prevent="emit('send', form)"
  >
    <label class="form__item">
      <span class="label">{{ t('reviews.name') }} *</span>
      <input v-model="form.name" class="field" type="text" :placeholder="t('reviews.name_placeholder')" required />
    </label>

    <label class="form__item">
      <span class="label">{{ t('reviews.company') }} *</span>
      <input v-model="form.company" class="field" type="text" :placeholder="t('reviews.company_placeholder')" required />
    </label>

    <label class="form__item">
      <span class="label">{{ t('reviews.link') }}</span>
      <TooltipBase :text="t('reviews.link_tooltip')">
        <input v-model="form.link" class="field" type="text" :placeholder="t('reviews.link_placeholder')" />
      </TooltipBase>
    </label>

    <div class="form__item">
      <span class="label">{{ t('reviews.rating') }}</span>
      <RatingStars v-model="form.rating" editable />
    </div>

    <div class="form__item form__item_large">
      <span class="label">{{ t('reviews.cooperations') }}</span>
      <label
        v-for="item in data.cooperations"
        :key="item.id"
        class="checkbox-row"
      >
        <CheckboxField v-model="form.cooperations" :value="item.documentId" />
        {{ item?.title }}
      </label>
    </div>

    <div class="form__item form__item_large">
      <span class="label">{{ t('reviews.developments') }}</span>
      <label
        v-for="item in data.developments"
        :key="item.id"
        class="checkbox-row"
      >
        <CheckboxField v-model="form.developments" :value="item.documentId" />
        {{ item?.title }}
      </label>
    </div>

    <label class="form__item">
      <span class="label">{{ t('reviews.text') }}</span>
      <textarea v-model="form.text" class="field" :placeholder="t('reviews.text_placeholder')" rows="6"></textarea>
    </label>

    <FilesUpload v-model="form.files" editable />

    <!-- Ловушка для ботов: человек это поле не видит, бот заполнит -->
    <label class="review-form__trap" aria-hidden="true">
      Website
      <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
    </label>

    <p v-if="error" class="review-form__error" role="alert">{{ error }}</p>

    <button class="btn" type="submit" :disabled="sending">{{ sending ? t('reviews.sending') : t('reviews.submit') }}</button>
  </form>
</template>

<script setup>
import { RatingStars, CheckboxField, TooltipBase, FilesUpload } from '~/components/common'

const { t } = useI18n()
const emit = defineEmits(['send'])

// Состояние формы живёт на странице (она же отправляет отзыв), поля меняются прямо в нём
defineProps({
  form: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  error: {
    type: String,
    default: null,
  },
  sending: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>
