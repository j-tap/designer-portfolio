<template>
  <div class="project-time">
    <div class="project-time__dates">
      <h2 class="project-time__title">{{ $t('project.development_time') }}</h2>
      <TitleOutline class="project-time__value" tag="time">
        {{ dateFormat(props.time.start) }}
      </TitleOutline>
      <TitleOutline class="project-time__value" tag="time">
        {{ dateFormat(props.time.end) }}
      </TitleOutline>
    </div>
    <div class="project-time__prices">
      <h2 class="project-time__title">{{ $t('project.price') }}</h2>
      <TitleOutline class="project-time__value" tag="div">
        {{ timeHours }} {{ $t('common.hour', timeHours) }}
      </TitleOutline>
      <TitleOutline class="project-time__value" tag="div">
        {{ priceFormat(timePrice) }}
      </TitleOutline>
    </div>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { priceFormat } from '~/utils/formatData'
import { dateFormat } from '~/utils/formatDate'
import { getHours } from '~/composables/useCalcPrice'

const props = defineProps({
  time: Object,
})

const timeHours = computed(() => {
  const { time } = props
  return getHours(time)
})

const timePrice = computed(() => getPrice(timeHours.value))
</script>

<style lang="scss" src="./style.scss" scoped />