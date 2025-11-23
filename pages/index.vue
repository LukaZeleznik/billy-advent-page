<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 font-sans selection:bg-red-200 selection:text-red-900">
    <AdGrid />
    
    <footer class="text-center py-8 text-gray-500 text-sm space-y-2 relative">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <span class="absolute left-1/4 top-1/2 animate-bounce text-2xl">⭐</span>
        <span class="absolute right-1/4 top-1/3 animate-bounce-slow text-2xl" style="animation-delay: 0.5s">❄️</span>
      </div>
      <p class="relative z-10">🎄 © {{ new Date().getFullYear() }} Adventni Dobrodelni Grid. Vsak prispevek šteje! 🎁</p>
      <p class="text-xs text-gray-400 relative z-10">Zbrana sredstva gredo v dobrodelne namene. ❤️</p>
    </footer>
    <DevTools />
  </div>
</template>
