<template>
  <LayoutBlank>
    <Error404 v-if="errorsStore.getDisplayContent404" />
    <slot v-else />
  </LayoutBlank>
</template>

<script setup>
import { LayoutBlank } from '~/components/layouts'
import { Error404 } from '~/components/sections'
import { useErrorsStore } from '~/stores/errorsStore'

const errorsStore = useErrorsStore()

onUpdated(() => {
  errorsStore.setDisplayContent404(false)
})
</script>
