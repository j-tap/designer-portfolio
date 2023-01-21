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
import {dateFormat, datesDiff, getWeekendsDays} from '~/utils/formatDate'

const props = defineProps({
  time: Object,
})

const RATE = 1200
const HOURS_DAY = 8

const timeHours = computed(() => {
  const { time } = props

  if (time) {
    const weekends = getWeekendsDays(time.start, time.end)
    const days = datesDiff(time.start, time.end, 'd')

    return (days - weekends.length) * HOURS_DAY
  }

  return 0
})

const timePrice = computed(() => timeHours.value * RATE)
</script>

<style lang="scss" src="./style.scss" scoped />