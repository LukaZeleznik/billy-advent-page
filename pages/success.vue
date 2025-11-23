<template>
  <div class="min-h-screen bg-gradient-to-br from-red-100 via-green-50 to-red-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-green-600">
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-black text-gray-900 mb-2 flex items-center justify-center gap-2">
          🎄 Plačilo Uspešno! 🎁
        </h1>
        <p class="text-gray-600">
          Vaša objava je bila kupljena in se bo kmalu pojavila na mreži. Hvala za podporo dobrodelnosti!
        </p>
      </div>

      <div class="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
        <p class="text-sm text-green-700 font-bold mb-2">ID Transakcije</p>
        <p class="text-xs font-mono text-gray-700 break-all">{{ sessionId }}</p>
      </div>

      <NuxtLink
        to="/"
        class="inline-block w-full bg-gradient-to-r from-red-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-red-700 hover:to-green-700 transition-all transform hover:scale-105"
      >
        Oglejte Si Vašo Objavo na Mreži 🎄
      </NuxtLink>

      <p class="text-xs text-gray-400 mt-4">
        Srčno hvala za podporo Adventni Dobrodelni Mreži! ❤️
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const sessionId = computed(() => route.query.session_id || 'Neznano');
</script>
