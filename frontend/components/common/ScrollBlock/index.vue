<template>
  <div
    ref="elem"
    class="scroll-block"
    @mousedown="start"
    @mouseleave="end"
    @mouseup="end"
    @mousemove="move"
  >
    <slot />
  </div>
</template>

<script setup>
const elem = ref(null)
let isDown = ref(false);
let startX = ref(0);
let startY = ref(0);
let scrollLeft = ref(0);
let scrollTop = ref(0);

function start ({ pageX, pageY }) {
  isDown.value = true
  startX.value = pageX - elem.value.offsetLeft
  startY.value = pageY - elem.value.offsetTop
  scrollLeft.value = elem.value.scrollLeft
  scrollTop.value = elem.value.scrollTop
}

function end () {
  isDown.value = false
}

function move (evt) {
  if (isDown.value) {
    evt.preventDefault()
    const x = evt.pageX - elem.value.offsetLeft
    const y = evt.pageY - elem.value.offsetTop
    const walkX = x - startX.value
    const walkY = y - startY.value

    elem.value.scrollLeft = scrollLeft.value - walkX
    elem.value.scrollTop = scrollTop.value - walkY
  }
}
</script>

<style lang="scss" src="./style.scss" scoped/>