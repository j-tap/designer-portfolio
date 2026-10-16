<template>
  <div v-if="sent" class="contact-form__success">
    <h3>{{ t('contact_form.success_title') }}</h3>
    <p>{{ t('contact_form.success_text') }}</p>
  </div>

  <form v-else class="form contact-form" @submit.prevent="send">
    <label class="form__item">
      <span class="label">{{ t('contact_form.name') }} *</span>
      <input v-model="form.name" class="field" type="text" name="name" autocomplete="name" :placeholder="t('contact_form.name_placeholder')" maxlength="100" required />
    </label>

    <label class="form__item">
      <span class="label">{{ t('contact_form.email') }} *</span>
      <input v-model="form.email" class="field" type="email" name="email" autocomplete="email" :placeholder="t('contact_form.email_placeholder')" maxlength="200" required />
    </label>

    <label class="form__item">
      <span class="label">{{ t('contact_form.message') }} *</span>
      <textarea v-model="form.message" class="field" name="message" :placeholder="t('contact_form.message_placeholder')" rows="5" maxlength="5000" required></textarea>
    </label>

    <!-- Ловушка для ботов: человек это поле не видит, бот заполнит -->
    <label class="contact-form__trap" aria-hidden="true">
      Website
      <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
    </label>

    <p v-if="error" class="contact-form__error" role="alert">{{ error }}</p>

    <button class="btn" type="submit" :disabled="sending">{{ sending ? t('contact_form.sending') : t('contact_form.submit') }}</button>
  </form>
</template>

<script setup>
/**
 * Форма связи. Защита от ботов та же, что у формы отзывов: подписанный токен от сервера
 * (форма, отправленная быстрее нескольких секунд, отклоняется), скрытое поле-ловушка и лимит
 * отправок на сервере. Токен запрашивается при монтировании — то есть при открытии окна.
 */
const emit = defineEmits(['sent'])

const { t, locale } = useI18n()
const client = useStrapiClient()
const route = useRoute()
const { $trackContactConversion } = useNuxtApp()

const form = reactive({ name: '', email: '', message: '', website: '' })
const formToken = ref(null)
const error = ref(null)
const sending = ref(false)
const sent = ref(false)

async function loadFormToken () {
  try {
    formToken.value = (await client('/contact-requests/form-token')).token
  }
  catch (e) {
    console.error('Error loading contact form token:', e)
  }
}

onMounted(loadFormToken)

async function send () {
  sending.value = true
  error.value = null

  try {
    await client('/contact-requests', {
      method: 'POST',
      body: { data: { ...form, formToken: formToken.value, locale: locale.value, page: route.fullPath } },
    })
    sent.value = true
    $trackContactConversion()
    emit('sent')
  }
  catch (e) {
    error.value = e?.error?.message || t('contact_form.send_error')
    // Токен мог устареть: берём новый, чтобы повторная отправка прошла
    loadFormToken()
  }
  finally {
    sending.value = false
  }
}
</script>

<style lang="scss" scoped src="./style.scss"/>
