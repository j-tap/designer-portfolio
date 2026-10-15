<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="model"
        class="modal"
        @mousedown.self="close"
      >
        <div
          ref="dialog"
          class="modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          tabindex="-1"
        >
          <button class="modal__close" type="button" :aria-label="t('modal.close')" @click="close">×</button>
          <h2 v-if="title" :id="titleId" class="modal__title">{{ title }}</h2>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useEventListener, useScrollLock } from '@vueuse/core'

/**
 * Универсальное всплывающее окно: затемнённый экран с размытием и блок по центру.
 * Открывается через v-model, закрывается крестиком, Esc или кликом по фону.
 * Содержимое — в слоте; заголовок (необязательный) — в пропе title.
 */
const model = defineModel({ type: Boolean, default: false })

defineProps({
  title: {
    type: String,
    default: null,
  },
})

const { t } = useI18n()
const titleId = useId()
const dialog = useTemplateRef('dialog')

function close () {
  model.value = false
}

useEventListener('keydown', (event) => {
  if (model.value && event.key === 'Escape') close()
})

// Страница под окном не прокручивается; фокус уходит в окно и возвращается на кнопку, открывшую его
const locked = import.meta.client ? useScrollLock(document.body) : ref(false)
let opener = null

watch(model, async (open) => {
  locked.value = open
  if (open) {
    opener = document.activeElement
    await nextTick()
    dialog.value?.focus()
  }
  else {
    opener?.focus?.()
    opener = null
  }
})

onBeforeUnmount(() => {
  locked.value = false
})
</script>

<style lang="scss" scoped src="./style.scss"/>
