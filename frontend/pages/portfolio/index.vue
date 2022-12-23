<template>
  <div>
    <h1>Portfolio</h1>
    <ul>
      <li>
        <NuxtLink :to="{ name: 'portfolio-category', params: { category: 'test1' } }">test1</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>

</script>