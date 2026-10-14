<template>
  <div class="project-time">
    <div class="project-time__dates">
      <h2 class="project-time__title">{{ t('project.development_time') }}</h2>
      <TitleOutline class="project-time__value" tag="time">
        {{ d(time.start, 'date') }}
      </TitleOutline>
      <TitleOutline v-if="time.end" class="project-time__value" tag="time">
        {{ d(time.end, 'date') }}
      </TitleOutline>
    </div>
    <div class="project-time__prices">
      <h2 class="project-time__title">{{ t('project.price') }}</h2>
      <TitleOutline class="project-time__value" tag="div">
        {{ timeHours }} {{ t('common.hour', timeHours) }}
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
import { getHours, getPrice } from '~/utils/projectTime'

const { t, d } = useI18n()
const siteMeta = useSiteMeta()
const props = defineProps({
  time: Object,
})

const timeHours = computed(() => getHours(props.time))
const timePrice = computed(() => getPrice(timeHours.value, siteMeta.value.payRate))
</script>

<style lang="scss" src="./style.scss" scoped />