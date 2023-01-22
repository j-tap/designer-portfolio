<template>
  <div :class="classes">
    <p
      v-if="isDisplayHint"
      class="images-items__notify"
    >
      {{ $t('carousel.pull_to_side_to_see_more') }} &rarr;
    </p>
    <div class="images-items__wrap-list">
      <ScrollBlock>
        <ul v-if="props.images.length" ref="elList" class="images-items__list">
          <li
            v-for="item in props.images"
            :key="item.id"
            class="images-items__item"
          >
            <ScrollBlock>
              <img :src="getUrl(item)" alt=" ">
            </ScrollBlock>
          </li>
        </ul>
      </ScrollBlock>
    </div>
  </div>
</template>

<script setup>
import { ScrollBlock } from '~/components/common'

const props = defineProps({
  images: Array,
  imagesSize: {
    type: String,
    validator: v => ['small', 'large'].includes(v),
  },
  displayHint: {
    type: Boolean,
    default: false,
  },
})
const elList = ref(null)
const widthScreen = ref(0)
const widthEl = ref(0)

const isDisplayHint = computed(() => props.displayHint && widthEl.value > widthScreen.value)

const classes = computed(() => {
  const cls = 'images-items'
  return [cls, `${cls}_size-${props.imagesSize}`]
})

function getUrl (item) {
  return urlFile(item.formats?.large?.url || item.formats?.medium.url || item.url)
}

async function onWidthResize () {
  widthScreen.value = window.innerWidth
  widthEl.value = 0

  for (const child of elList.value.children) {
    widthEl.value += child.offsetWidth
  }
}

onMounted(() => {
  window.addEventListener('resize', onWidthResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWidthResize)
})
</script>

<style lang="scss" src="./style.scss" scoped />