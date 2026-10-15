<template>
  <section class="landing-contact">
    <h2 class="landing-contact__title">{{ section.title }}</h2>
    <HtmlMarked v-if="section.text" class="landing-contact__text" :text="section.text" />

    <div class="landing-contact__actions">
      <NuxtLink
        v-if="section.cta_label"
        class="btn landing-contact__cta"
        :to="requestHref"
      >
        {{ section.cta_label }}
      </NuxtLink>
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
  </section>
</template>

<script setup>
import { HtmlMarked, IconBase } from '~/components/common'
import { safeUrl } from '~/utils/url'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const localePath = useLocalePath()
const contacts = useContacts()

// Адреса — из «Контактов» в Strapi: E-mail (mailto:) и WhatsApp (wa.me)
const findContact = test => contacts.value.find(item => test(item.link || ''))?.link

const emailHref = computed(() => {
  const link = safeUrl(findContact(link => link.startsWith('mailto:')))
  if (!link) return null
  const subject = props.section.email_subject
  return subject ? `${link}${link.includes('?') ? '&' : '?'}subject=${encodeURIComponent(subject)}` : link
})

// Без E-mail кнопка ведёт на страницу контактов
const requestHref = computed(() => emailHref.value || localePath('/contacts'))

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
