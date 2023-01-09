<template>
  <div
    ref="elem"
    :class="classes"
    @mousedown.capture="start"
    @mouseleave="end"
    @mouseup="end"
    @mousemove="move"
    @click.capture="click"
  >
    <slot />
  </div>
</template>

<script setup>
const elem = ref(null)
let isDown = ref(false);
let isScrolled = ref(false);
let startX = ref(0);
let startY = ref(0);
let scrollLeft = ref(0);
let scrollTop = ref(0);
const classes = computed(() => [
  'scroll-block',
  { 'scroll-block_scrolled': isScrolled.value },
])

function start (evt) {
  isDown.value = true
  startX.value = evt.pageX - elem.value.offsetLeft
  startY.value = evt.pageY - elem.value.offsetTop
  scrollLeft.value = elem.value.scrollLeft
  scrollTop.value = elem.value.scrollTop
}

function end () {
  isDown.value = false
  setTimeout(() => {
    isScrolled.value = false
  }, 0)
}

function move (evt) {
  if (isDown.value) {
    const x = evt.pageX - elem.value.offsetLeft
    const y = evt.pageY - elem.value.offsetTop
    const walkX = x - startX.value
    const walkY = y - startY.value

    if (Math.abs(walkX) > 0 || Math.abs(walkY) > 0) {
      isScrolled.value = true

      elem.value.scrollLeft = scrollLeft.value - walkX
      elem.value.scrollTop = scrollTop.value - walkY

      evt.preventDefault()
    }
  }
}

function click (evt) {
  if (isScrolled.value) {
    evt.stopPropagation()
    evt.preventDefault()
  }
}
</script>

<style lang="scss" src="./style.scss" scoped/>