<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Million Dollar Advent Calendar',
  meta: [
    { name: 'description', content: 'Own a piece of the advent grid.' }
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
