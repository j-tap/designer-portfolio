<template>
  <section v-if="active && undecided" class="cookie-banner" role="region" :aria-label="t('cookies.label')">
    <p class="cookie-banner__text">{{ t('cookies.text') }}</p>
    <div class="cookie-banner__actions">
      <button class="btn btn_xs cookie-banner__btn" type="button" @click="choose('granted')">{{ t('cookies.accept') }}</button>
      <button class="btn btn_xs cookie-banner__btn" type="button" @click="choose('denied')">{{ t('cookies.reject') }}</button>
    </div>
  </section>
</template>

<script setup>
/**
 * Баннер согласия на cookie (GDPR). Кнопки «Принять» и «Отклонить» одинаковые — этого требует
 * испанский регулятор (AEPD). Показывается только там, где включены аналитика и реклама
 * (useTrackingActive), и пока посетитель не выбрал; выбор читается только в браузере,
 * поэтому баннер появляется после монтирования, а не при серверном рендере
 */
const { t } = useI18n()
const active = useTrackingActive()
const undecided = ref(false)

onMounted(() => {
  undecided.value = readCookieConsent() === null
})

function choose (value) {
  saveCookieConsent(value)
  undecided.value = false
}
</script>

<style lang="scss" src="./style.scss" scoped />
