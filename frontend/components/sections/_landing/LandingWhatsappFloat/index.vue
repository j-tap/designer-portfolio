<template>
  <Transition name="landing-whatsapp-float">
    <a
      v-if="visible"
      class="landing-whatsapp-float"
      :href="href"
      target="_blank"
      rel="noopener"
      :aria-label="label"
    >
      <IconBase class="landing-whatsapp-float__icon" name="social-whatsapp" />
    </a>
  </Transition>
</template>

<script setup>
/**
 * Плавающая кнопка WhatsApp на телефоне и планшете: появляется после первого экрана,
 * пока баннер cookie не перекрывает низ экрана. На компьютере не показывается (style.scss)
 */
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import { IconBase } from '~/components/common'

defineProps({
  href: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'WhatsApp',
  },
})

const { y } = useWindowScroll()
const { height } = useWindowSize()
const bannerOpen = useCookieBannerOpen()
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const visible = computed(() => mounted.value && !bannerOpen.value && y.value > height.value * .6)
</script>

<style lang="scss" src="./style.scss" scoped />
