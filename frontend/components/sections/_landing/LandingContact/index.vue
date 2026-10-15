<template>
  <section class="landing-contact">
    <h2 class="landing-contact__title">{{ section.title }}</h2>
    <HtmlMarked v-if="section.text" class="landing-contact__text" :text="section.text" />

    <div class="landing-contact__actions">
      <button
        v-if="section.cta_label"
        class="btn landing-contact__cta"
        type="button"
        @click="isFormOpen = true"
      >
        {{ section.cta_label }}
      </button>
      <a
        v-if="whatsappHref && section.whatsapp_label"
        class="landing-contact__whatsapp"
        :href="whatsappHref"
        target="_blank"
        rel="noopener"
      >
        <IconBase class="landing-contact__whatsapp-icon" name="social-whatsapp" />
        {{ section.whatsapp_label }}
      </a>
    </div>

    <p v-if="section.signature" class="landing-contact__signature">{{ section.signature }}</p>

    <ModalBase v-model="isFormOpen" :title="section.cta_label || t('contact_form.title')">
      <ContactForm />
    </ModalBase>
  </section>
</template>

<script setup>
import { HtmlMarked, IconBase, ModalBase } from '~/components/common'
import ContactForm from '../ContactForm'
import { safeUrl } from '~/utils/url'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const { t } = useI18n()
const contacts = useContacts()
const isFormOpen = ref(false)

// WhatsApp — из «Контактов» в Strapi (wa.me)
const findContact = test => contacts.value.find(item => test(item.link || ''))?.link

const whatsappHref = computed(() => {
  const link = safeUrl(findContact(link => /wa\.me|whatsapp/i.test(link)))
  if (!link || !props.section.whatsapp_message) return link
  try {
    const url = new URL(link)
    url.searchParams.set('text', props.section.whatsapp_message)
    return url.toString()
  }
  catch {
    return link
  }
})
</script>

<style lang="scss" src="./style.scss" scoped />
