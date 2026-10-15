<template>
  <div
    ref="root"
    :class="['lang-switcher', { 'lang-switcher_open': open }]"
    @keydown.esc="close(true)"
  >
    <button
      ref="toggle"
      class="lang-switcher__toggle"
      type="button"
      :aria-label="`${t('menu.language')}: ${current.name}`"
      :aria-expanded="open"
      :aria-controls="listId"
      @click="open = !open"
    >
      {{ current.code }}
      <IconBase class="lang-switcher__arrow" name="chevron-down" size="xs"/>
    </button>
    <!-- Список в разметке и закрытым: ссылки на другие языки видят поисковики -->
    <ul :id="listId" class="lang-switcher__list">
      <li
        v-for="item in items"
        :key="item.code"
      >
        <NuxtLink
          class="lang-switcher__link"
          :to="item.path"
          :hreflang="item.code"
          :lang="item.code"
          :aria-label="item.name"
          @click="emit('select', item.code)"
        >{{ item.code }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'
import { IconBase } from '~/components/common'

const { t, locale, locales } = useI18n()
const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const { paths } = usePageLocales()

const emit = defineEmits(['select'])

const listId = useId()
const root = useTemplateRef('root')
const toggle = useTemplateRef('toggle')
const open = ref(false)

// Esc возвращает фокус на кнопку: иначе он остался бы на скрытой ссылке
function close (focusToggle = false) {
  if (open.value && focusToggle) toggle.value?.focus()
  open.value = false
}

onClickOutside(root, () => close())
watch(() => route.fullPath, () => close())

const current = computed(() => locales.value.find(({ code }) => code === locale.value))

// Страница есть на всех языках: записи Strapi без перевода показываются на языке оригинала.
// У версий посадочной страницы свои адреса (slug на каждом языке)
const items = computed(() => locales.value
  .filter(({ code }) => code !== locale.value)
  .map(({ code, name }) => ({ code, name, path: paths.value[code] ?? switchLocalePath(code) })))
</script>

<style lang="scss" src="./style.scss" scoped/>
