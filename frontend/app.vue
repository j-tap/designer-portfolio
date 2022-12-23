<script setup>
const route = useRoute()

useHead({
  title: route.meta.title,
  meta: [
    { name: 'description', content: route.meta.description },
    { property: 'og:title', content: route.meta.title },
  ],
})
</script>

<template>
  <div class="app-container">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<style lang="scss" src="~/assets/style/app.scss"/>