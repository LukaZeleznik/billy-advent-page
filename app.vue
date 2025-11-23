<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Adventna Dobrodelna Mreža',
  meta: [
    { name: 'description', content: 'Podprite dobrodelnost z nakupom pikslov na adventni mreži.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap' }
  ]
});
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
