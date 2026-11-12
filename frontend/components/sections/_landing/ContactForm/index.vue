<template>
  <div v-if="sent" class="contact-form__success">
    <h3>{{ t('contact_form.success_title') }}</h3>
    <p>{{ t('contact_form.success_text') }}</p>
  </div>

  <!-- data-clarity-mask: то, что посетитель вводит в форму, не попадает в записи Clarity -->
  <form v-else class="form contact-form" data-clarity-mask="True" @submit.prevent="send">
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

    <fieldset class="form__item contact-form__choices">
      <legend class="label contact-form__legend">
        {{ t('contact_form.topics_label') }} <span class="contact-form__optional">{{ t('contact_form.optional') }}</span>
      </legend>
      <div class="contact-form__chips">
        <button
          v-for="option in topics"
          :key="option"
          :class="['contact-form__chip', { 'contact-form__chip_active': form.topics.includes(option) }]"
          type="button"
          :aria-pressed="form.topics.includes(option)"
          @click="toggleTopic(option)"
        >
          {{ option }}
        </button>
      </div>
    </fieldset>

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

    <!-- Кому не хочется заполнять форму, может сразу написать в WhatsApp -->
    <a v-if="whatsappHref" class="contact-form__alt" :href="whatsappHref" target="_blank" rel="noopener">
      <IconBase class="contact-form__alt-icon" name="social-whatsapp" />
      {{ t('contact_form.whatsapp_alt') }}
    </a>
  </form>
</template>

<script setup>
/**
 * Форма связи. Защита от ботов та же, что у формы отзывов: подписанный токен от сервера
 * (форма, отправленная быстрее нескольких секунд, отклоняется), скрытое поле-ловушка и лимит
 * отправок на сервере. Токен запрашивается при монтировании — то есть при открытии окна.
 * Обязательны только имя и e-mail: остальное посетитель заполняет, если хочет.
 */
import { IconBase } from '~/components/common'

defineProps({
  // Запасной путь для тех, кому проще написать в мессенджер, чем заполнять форму
  whatsappHref: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['sent'])

const { t, locale } = useI18n()
const client = useStrapiClient()
const route = useRoute()
const { $trackContactConversion } = useNuxtApp()

const emptyDraft = () => ({ name: '', email: '', message: '', website: '', topics: [] })

// Черновик живёт дольше окна: закрыл форму кликом мимо или по Esc — при повторном открытии
// введённое на месте
const form = useState('contact-form-draft', emptyDraft).value

// Готовые ответы вместо текста: что нужно (можно несколько). Выбранное уходит в начало сообщения
const topics = computed(() => ['new', 'redesign', 'audit', 'crm'].map(key => t(`contact_form.topic_${key}`)))

// Повторный клик снимает выбор
function toggleTopic (option) {
  form.topics = form.topics.includes(option)
    ? form.topics.filter(item => item !== option)
    : [...form.topics, option]
}

// Сервер требует непустое сообщение, а для посетителя оно необязательно
function composeMessage () {
  return [
    form.topics.length && `${t('contact_form.topics_label')} ${form.topics.join(', ')}`,
    form.message.trim(),
  ].filter(Boolean).join('\n\n') || '—'
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
    Object.assign(form, emptyDraft())
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
