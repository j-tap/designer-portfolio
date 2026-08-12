<template>
  <Error404 />
</template>

<script setup>
import { Error404 } from  '~/components/sections'

// Несуществующий адрес должен отдавать 404, иначе поисковики видят «мягкий 404» со статусом 200
const event = useRequestEvent()

if (event) {
  setResponseStatus(event, 404)
}
</script>
