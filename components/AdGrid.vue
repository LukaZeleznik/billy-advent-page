<template>
  <div class="max-w-[1400px] mx-auto px-4 py-12 flex flex-col items-center relative">
    <!-- Snowfall Animation -->
    <div class="snowfall"></div>
    
    <div class="text-center mb-8 space-y-4 relative">
      <!-- Christmas Lights -->
      <div class="christmas-lights mb-4">
        <div class="light red"></div>
        <div class="light green"></div>
        <div class="light yellow"></div>
        <div class="light blue"></div>
        <div class="light red"></div>
        <div class="light green"></div>
        <div class="light yellow"></div>
        <div class="light blue"></div>
      </div>
      
      <div class="flex items-center justify-center gap-3 mb-2">
        <span class="text-6xl animate-bounce-slow">🎄</span>
        <h1 class="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 drop-shadow-sm animate-glow">
          ADVENTNA<br/>DOBRODELNA MREŽA
        </h1>
        <span class="text-6xl animate-bounce-slow-delayed">🎁</span>
      </div>
      <p class="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
        24 dni. 1 Milijon Pikslov. Podprite dobrodelnost. ❤️
      </p>
      <p class="text-sm text-gray-500 max-w-xl mx-auto">
        Vsak piksel pomaga! Kupite prostor na mreži in podprite dobre namene to praznično sezoni.
      </p>
    </div>

    <!-- Grid Container -->
    <div 
      ref="gridRef"
      class="relative bg-white shadow-2xl border-4 border-red-700 select-none overflow-hidden rounded-lg"
      :style="{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }"
      @mousedown="startSelection"
    >
      <!-- Zones Layer (Background) -->
      <div 
        v-for="day in 24" 
        :key="day"
        class="absolute border border-red-100 flex items-center justify-center transition-all duration-500 group/zone"
        :class="[
          isZoneUnlocked(day) ? 'bg-transparent hover:bg-green-50/30' : 'bg-gray-100/95 z-50 hover:animate-wiggle cursor-not-allowed'
        ]"
        :style="getZoneStyle(day)"
      >
        <div v-if="!isZoneUnlocked(day)" class="text-center relative z-50">
          <span class="text-4xl group-hover/zone:scale-110 inline-block transition-transform">🔒</span>
          <div class="font-bold text-red-600 mt-2 bg-white/80 px-2 py-1 rounded group-hover/zone:bg-white transition-all">
            {{ day }}. December
            <div class="text-xs text-gray-500">⭐ Kmalu odprt!</div>
          </div>
        </div>
        <div v-else class="absolute inset-0 opacity-5 pointer-events-none christmas-pattern"></div>
        <!-- Sparkle on unlocked zones -->
        <div v-if="isZoneUnlocked(day)" class="absolute top-1 right-1 text-xs animate-pulse">✨</div>
      </div>

      <!-- Ads Layer -->
      <a 
        v-for="ad in ads" 
        :key="ad.id"
        :href="ad.linkUrl"
        target="_blank"
        class="absolute hover:z-20 transition-transform hover:scale-[1.02] shadow-sm hover:shadow-xl group z-10"
        :style="{
          left: `${ad.x}px`,
          top: `${ad.y}px`,
          width: `${ad.width}px`,
          height: `${ad.height}px`
        }"
        @mousedown.stop 
      >
        <img :src="ad.imageUrl" :alt="ad.altText" class="w-full h-full object-cover" />
        <!-- Tooltip -->
        <div class="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
          {{ ad.ownerName }}
        </div>
      </a>

      <!-- Selection Box -->
      <div 
        v-if="selection.active || selection.completed"
        class="absolute border-2 border-yellow-500 bg-yellow-500/20 z-30 pointer-events-none"
        :class="{ 'border-red-500 bg-red-500/20': selection.invalid }"
        :style="{
          left: `${selection.x}px`,
          top: `${selection.y}px`,
          width: `${selection.width}px`,
          height: `${selection.height}px`
        }"
      >
        <div class="absolute -top-8 left-0 bg-black text-white text-xs px-1 rounded">
          {{ selection.width }}x{{ selection.height }}
        </div>
      </div>

      <!-- Buy Button (Floating near selection) -->
      <div 
        v-if="selection.completed && !selection.invalid"
        class="absolute z-40"
        :style="{
          left: `${selection.x + selection.width / 2}px`,
          top: `${selection.y + selection.height / 2}px`
        }"
        @mousedown.stop
      >
        <button 
          @click="openBuyModal"
          class="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all animate-pulse-slow relative"
        >
          <span class="relative z-10">✨ KUPI (€{{ calculatePrice(selection.width, selection.height) }}) ✨</span>
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 hover:opacity-30 rounded transition-opacity blur"></div>
        </button>
      </div>
    </div>

    <div class="mt-8 text-gray-600 text-sm text-center">
      🎄 Kliknite in povlecite po odklenjenih conah, da izberete svoj prostor. 🎁
    </div>

    <BuyModal
      :is-open="isModalOpen"
      :selection="selection"
      @close="closeModal"
      @buy="handleBuy"
    />
  </div>
</template>

<script setup lang="ts">
import { useAdStore, GRID_WIDTH, GRID_HEIGHT } from '~/composables/useAdStore';

const { ads, buyAd, getZoneForDay, isZoneUnlocked, checkCollision, calculatePrice, init } = useAdStore();

const gridRef = ref<HTMLElement | null>(null);
const isModalOpen = ref(false);

// Selection State
const selection = reactive({
  active: false,
  completed: false,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  invalid: false
});

onMounted(() => {
  init();
});

const getZoneStyle = (day: number) => {
  const zone = getZoneForDay(day);
  return {
    left: `${zone.x}px`,
    top: `${zone.y}px`,
    width: `${zone.width}px`,
    height: `${zone.height}px`
  };
};

const getMousePos = (e: MouseEvent) => {
  if (!gridRef.value) return { x: 0, y: 0 };
  const rect = gridRef.value.getBoundingClientRect();
  
  // Allow coordinates slightly outside but clamp them
  const x = Math.max(0, Math.min(GRID_WIDTH, e.clientX - rect.left));
  const y = Math.max(0, Math.min(GRID_HEIGHT, e.clientY - rect.top));
  return { x, y };
};

const startSelection = (e: MouseEvent) => {
  if (isModalOpen.value) return;
  // Prevent default to avoid text selection cursor
  e.preventDefault();
  
  const { x, y } = getMousePos(e);
  
  // Snap to grid
  const snap = 10;
  const snappedX = Math.floor(x / snap) * snap;
  const snappedY = Math.floor(y / snap) * snap;

  selection.active = true;
  selection.completed = false;
  selection.startX = snappedX;
  selection.startY = snappedY;
  selection.x = snappedX;
  selection.y = snappedY;
  selection.width = 0;
  selection.height = 0;
  selection.invalid = false;

  // Add global listeners
  window.addEventListener('mousemove', updateSelection);
  window.addEventListener('mouseup', endSelection);
};

const updateSelection = (e: MouseEvent) => {
  if (!selection.active) return;
  
  const { x, y } = getMousePos(e);
  const snap = 10;
  const currentX = Math.floor(x / snap) * snap;
  const currentY = Math.floor(y / snap) * snap;

  // Calculate rect
  const minX = Math.min(selection.startX, currentX);
  const minY = Math.min(selection.startY, currentY);
  const width = Math.abs(currentX - selection.startX);
  const height = Math.abs(currentY - selection.startY);

  selection.x = minX;
  selection.y = minY;
  selection.width = width;
  selection.height = height;

  // Validation
  if (width === 0 || height === 0) {
    selection.invalid = true;
    return;
  }

  const isOverlapping = checkCollision({ x: minX, y: minY, width, height });
  
  let isLocked = false;
  for (let day = 1; day <= 24; day++) {
    if (!isZoneUnlocked(day)) {
      const zone = getZoneForDay(day);
      if (
        minX < zone.x + zone.width &&
        minX + width > zone.x &&
        minY < zone.y + zone.height &&
        minY + height > zone.y
      ) {
        isLocked = true;
        break;
      }
    }
  }

  selection.invalid = isOverlapping || isLocked;
};

const endSelection = () => {
  if (!selection.active) return;
  
  selection.active = false;
  if (selection.width > 0 && selection.height > 0) {
    selection.completed = true;
  } else {
    selection.completed = false;
  }

  // Remove global listeners
  window.removeEventListener('mousemove', updateSelection);
  window.removeEventListener('mouseup', endSelection);
};

const openBuyModal = () => {
  if (selection.invalid) return;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selection.completed = false;
};

const handleBuy = async (adData: any) => {
  const payload = {
    x: selection.x,
    y: selection.y,
    width: selection.width,
    height: selection.height,
    price: calculatePrice(selection.width, selection.height),
    ...adData
  };
  
  try {
    const result = await $fetch<{ url: string }>('/api/create-checkout-session', {
      method: 'POST',
      body: payload
    });
    
    // Redirect to Stripe Checkout
    if (result.url) {
      window.location.href = result.url;
    }
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    alert('Failed to start checkout. Please try again.');
  }
  
  closeModal();
};
</script>

<style scoped>
/* Christmas Pattern */
.christmas-pattern {
  background-image: 
    linear-gradient(45deg, rgba(220, 38, 38, 0.1) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(220, 38, 38, 0.1) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* Snowfall Animation */
.snowfall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, white, transparent),
    radial-gradient(1px 1px at 90px 10px, white, transparent),
    radial-gradient(1px 1px at 130px 50px, white, transparent),
    radial-gradient(2px 2px at 160px 80px, white, transparent),
    radial-gradient(1px 1px at 200px 20px, white, transparent);
  background-size: 200px 200px;
  animation: snowfall 10s linear infinite;
  opacity: 0.6;
}

@keyframes snowfall {
  0% { background-position: 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px; }
  100% { background-position: 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px; }
}

/* Christmas Lights */
.christmas-lights {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0 auto;
  max-width: 600px;
}

.light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 20px currentColor;
  animation: twinkle 2s infinite;
}

.light.red {
  background: #dc2626;
  color: #dc2626;
  animation-delay: 0s;
}

.light.green {
  background: #16a34a;
  color: #16a34a;
  animation-delay: 0.5s;
}

.light.yellow {
  background: #eab308;
  color: #eab308;
  animation-delay: 1s;
}

.light.blue {
  background: #3b82f6;
  color: #3b82f6;
  animation-delay: 1.5s;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
}

/* Bounce Animations */
.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

.animate-bounce-slow-delayed {
  animation: bounce-slow 3s ease-in-out infinite;
  animation-delay: 0.3s;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Glow Animation */
.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { filter: drop-shadow(0 0 5px rgba(220, 38, 38, 0.5)); }
  to { filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.8)); }
}

/* Wiggle Animation */
.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
}

/* Pulse Slow */
.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
}

/* Sparkle */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}
</style>
