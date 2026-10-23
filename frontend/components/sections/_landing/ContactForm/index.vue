<template>
  <div v-if="sent" class="contact-form__success">
    <h3>{{ t('contact_form.success_title') }}</h3>
    <p>{{ t('contact_form.success_text') }}</p>
  </div>

  <form v-else class="form contact-form" @submit.prevent="send">
    <fieldset v-for="group in choiceGroups" :key="group.name" class="form__item contact-form__choices">
      <legend class="label contact-form__legend">{{ group.label }}</legend>
      <div class="contact-form__chips">
        <button
          v-for="option in group.options"
          :key="option"
          :class="['contact-form__chip', { 'contact-form__chip_active': isChosen(group, option) }]"
          type="button"
          :aria-pressed="isChosen(group, option)"
          @click="choose(group, option)"
        >
          {{ option }}
        </button>
      </div>
    </fieldset>

    <div class="contact-form__row">
      <label class="form__item">
        <span class="label">{{ t('contact_form.name') }} *</span>
        <input v-model="form.name" class="field" type="text" name="name" autocomplete="name" :placeholder="t('contact_form.name_placeholder')" maxlength="100" required />
      </label>

      <label class="form__item">
        <span class="label">{{ t('contact_form.email') }} *</span>
        <input v-model="form.email" class="field" type="email" name="email" autocomplete="email" :placeholder="t('contact_form.email_placeholder')" maxlength="200" required />
      </label>
    </div>

    <label class="form__item">
      <span class="label">{{ t('contact_form.message') }} <span class="contact-form__optional">{{ t('contact_form.optional') }}</span></span>
      <textarea v-model="form.message" class="field" name="message" :placeholder="t('contact_form.message_placeholder')" rows="3" maxlength="4000"></textarea>
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

const form = reactive({ name: '', email: '', message: '', website: '', topics: [], timeline: '' })

// Готовые ответы вместо текста: что нужно (можно несколько) и когда начинать (один).
// Выбранное уходит в начало сообщения
const choiceGroups = computed(() => [
  {
    name: 'topics',
    multiple: true,
    label: t('contact_form.topics_label'),
    options: ['new', 'redesign', 'audit', 'crm'].map(key => t(`contact_form.topic_${key}`)),
  },
  {
    name: 'timeline',
    multiple: false,
    label: t('contact_form.timeline_label'),
    options: ['asap', 'soon', 'exploring'].map(key => t(`contact_form.timeline_${key}`)),
  },
])

function isChosen (group, option) {
  return group.multiple ? form[group.name].includes(option) : form[group.name] === option
}

// Повторный клик снимает выбор
function choose (group, option) {
  const value = form[group.name]
  if (!group.multiple) form[group.name] = value === option ? '' : option
  else form[group.name] = value.includes(option) ? value.filter(item => item !== option) : [...value, option]
}

function composeMessage () {
  return [
    form.topics.length && `${t('contact_form.topics_label')} ${form.topics.join(', ')}`,
    form.timeline && `${t('contact_form.timeline_label')} ${form.timeline}`,
    form.message.trim(),
  ].filter(Boolean).join('\n\n')
}
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
  const message = composeMessage()
  if (!message) {
    error.value = t('contact_form.empty_error')
    return
  }

  sending.value = true
  error.value = null

  try {
    await client('/contact-requests', {
      method: 'POST',
      body: {
        data: {
          name: form.name,
          email: form.email,
          message,
          website: form.website,
          formToken: formToken.value,
          locale: locale.value,
          page: route.fullPath,
        },
      },
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
