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
        <div class="donate-item__value-row">
          <component
            :is="item.link ? 'a' : 'span'"
            :href="item.link || undefined"
            :target="item.link ? '_blank' : undefined"
            :rel="item.link ? 'noopener' : undefined"
            class="donate-item__value"
          >{{ item.value }}</component>
          <button
            v-if="item.copyable !== false"
            type="button"
            class="donate-item__copy"
            @click="copy(item)"
          >{{ copiedId === item.id ? t('donate.copied') : t('donate.copy') }}</button>
        </div>
      </div>
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
const copiedId = ref(null)
let timer = null

async function copy (item) {
  try {
    await navigator.clipboard.writeText(item.value)
    copiedId.value = item.id
    clearTimeout(timer)
    timer = setTimeout(() => {
      copiedId.value = null
    }, 2000)
  }
  catch (error) {
    console.error('Error copy donate value:', error)
  }
}
</script>

<style lang="scss" scoped src="./style.scss"/>
