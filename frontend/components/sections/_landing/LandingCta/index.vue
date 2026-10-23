<template>
  <aside class="landing-cta">
    <p class="landing-cta__text">{{ t('landing.cta_text') }}</p>
    <div class="landing-cta__actions">
      <button class="btn landing-cta__btn" type="button" @click="isFormOpen = true">{{ label }}</button>
      <a
        v-if="whatsappHref"
        class="landing-cta__whatsapp"
        :href="whatsappHref"
        target="_blank"
        rel="noopener"
      >
        <IconBase class="landing-cta__whatsapp-icon" name="social-whatsapp" />
        WhatsApp
      </a>
    </div>

    <ModalBase v-model="isFormOpen" :title="label">
      <ContactForm />
    </ModalBase>
  </aside>
</template>

<script setup>
/**
 * Призыв связаться посреди посадочной страницы (после проектов и отзывов):
 * чтобы не листать до блока контактов в самом низу
 */
import { IconBase, ModalBase } from '~/components/common'
import ContactForm from '../ContactForm'

defineProps({
  // Текст кнопки — тот же, что в блоке контактов
  label: {
    type: String,
    required: true,
  },
  whatsappHref: {
    type: String,
    default: null,
  },
})

const { t } = useI18n()
const isFormOpen = ref(false)
</script>

<style lang="scss" src="./style.scss" scoped />
