<template>
  <ul v-if="items?.length" class="donate-list">
    <li
      v-for="item in items"
      :key="item.id"
      class="donate-list__item donate-item"
    >
      <img
        v-if="item.icon?.url"
        :src="item.icon.url"
        :alt="item.title"
        class="donate-item__icon"
      >
      <div class="donate-item__body">
        <h2 class="donate-item__title">{{ item.title }}</h2>
        <p v-if="item.description" class="donate-item__description">{{ item.description }}</p>
        <div v-if="item.requisites?.length" class="donate-item__values">
          <div
            v-for="(requisite, index) in item.requisites"
            :key="requisite.id ?? index"
            class="donate-item__requisite"
          >
            <span v-if="requisite.label" class="donate-item__label">{{ requisite.label }}</span>
            <div class="donate-item__value-row">
              <component
                :is="requisite.link ? 'a' : 'span'"
                :href="requisite.link || undefined"
                :target="requisite.link ? '_blank' : undefined"
                :rel="requisite.link ? 'noopener' : undefined"
                class="donate-item__value"
              >{{ requisite.value }}</component>
              <button
                type="button"
                class="donate-item__copy"
                @click="copy(item, requisite, index)"
              >{{ copiedKey === keyOf(item, requisite, index) ? t('donate.copied') : t('donate.copy') }}</button>
            </div>
          </div>
        </div>
      </div>
      <img
        v-if="item.qr?.url"
        :src="item.qr.url"
        :alt="t('donate.qr_{title}', { title: item.title })"
        class="donate-item__qr"
        loading="lazy"
      >
    </li>
  </ul>
  <p v-else class="donate-list__empty">{{ t('donate.empty') }}</p>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const { t } = useI18n()
const copiedKey = ref(null)
let timer = null

function keyOf (item, requisite, index) {
  return `${item.id}-${requisite.id ?? index}`
}

async function copy (item, requisite, index) {
  try {
    await navigator.clipboard.writeText(requisite.value)
    copiedKey.value = keyOf(item, requisite, index)
    clearTimeout(timer)
    timer = setTimeout(() => {
      copiedKey.value = null
    }, 2000)
  }
  catch (error) {
    console.error('Error copy donate value:', error)
  }
}
</script>

<style lang="scss" scoped src="./style.scss"/>
