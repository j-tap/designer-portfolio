<template>
  <Teleport to="body">
    <Transition name="image-zoom">
      <div
        v-if="src"
        ref="root"
        class="image-zoom"
        role="dialog"
        aria-modal="true"
        :aria-label="alt || t('image_zoom.label')"
        tabindex="-1"
        @click.self="close"
      >
        <button class="image-zoom__close" type="button" :aria-label="t('modal.close')" @click="close">×</button>
        <img
          :class="['image-zoom__img', { 'image-zoom__img_natural': natural }]"
          :src="src"
          :alt="alt"
          @click="natural = !natural"
        >
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useEventListener } from '@vueuse/core'

/**
 * Картинка на весь экран. Сначала — по ширине экрана (длинный макет листается вниз),
 * клик по картинке — в натуральную величину и обратно. Закрывается крестиком, Esc или кликом
 * по фону: формы здесь нет, терять нечего.
 * Esc перехватывается раньше окна-родителя (ModalBase), чтобы закрылась только картинка.
 */
const src = defineModel({ type: String, default: null })

defineProps({
  alt: {
    type: String,
    default: '',
  },
})

const { t } = useI18n()
const root = useTemplateRef('root')
const natural = ref(false)

function close () {
  src.value = null
}

useEventListener('keydown', (event) => {
  if (src.value && event.key === 'Escape') {
    event.stopImmediatePropagation()
    close()
  }
}, { capture: true })

// Фокус — в окно картинки, после закрытия — на место, откуда её открыли
let opener = null
watch(src, async (value) => {
  natural.value = false
  if (value) {
    opener = document.activeElement
    await nextTick()
    root.value?.focus()
  }
  else {
    opener?.focus?.()
    opener = null
  }
})
</script>

<style lang="scss" src="./style.scss" scoped />
