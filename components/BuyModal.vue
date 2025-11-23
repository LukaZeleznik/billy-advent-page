<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-4 border-red-600">
      <div class="bg-gradient-to-r from-red-600 to-green-600 p-4 flex justify-between items-center">
        <h2 class="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          🎄 Kupite prostor {{ selection.width }}x{{ selection.height }}
        </h2>
        <button @click="close" class="text-white hover:text-red-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6 space-y-4">
        <div class="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <p class="text-red-700 text-sm uppercase font-bold">Skupna Cena</p>
          <p class="text-4xl font-black text-green-600">€{{ price.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ selection.width * selection.height }} pikslov po ~€0.05/piksel</p>
        </div>

        <p class="text-gray-600 text-sm">
          Naložite svojo sliko in povezavo za izbran prostor. Vsak prispevek gre v dobre namene! 🎁
        </p>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Ime / Podjetje</label>
            <input v-model="form.ownerName" type="text" required class="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-red-400 focus:ring-0 outline-none transition-colors" placeholder="Vaše Ime ali Podjetje" />
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">URL Slike</label>
            <input v-model="form.imageUrl" type="url" required class="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-red-400 focus:ring-0 outline-none transition-colors" placeholder="https://primer.si/slika.png" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">URL Povezave</label>
            <input v-model="form.linkUrl" type="url" required class="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-red-400 focus:ring-0 outline-none transition-colors" placeholder="https://primer.si" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Alt Besedilo</label>
            <input v-model="form.altText" type="text" required class="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-red-400 focus:ring-0 outline-none transition-colors" placeholder="Opis vaše objave" />
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-red-600 to-green-600 text-white font-black py-3 rounded-lg shadow-lg hover:from-red-700 hover:to-green-700 transform hover:scale-[1.02] transition-all">
            PLAČAJ €{{ price.toLocaleString() }} 🎄
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdStore } from '~/composables/useAdStore';

const props = defineProps<{
  isOpen: boolean;
  selection: {
    width: number;
    height: number;
  };
}>();

const emit = defineEmits(['close', 'buy']);
const { calculatePrice } = useAdStore();

const price = computed(() => calculatePrice(props.selection.width, props.selection.height));

const form = reactive({
  imageUrl: '',
  linkUrl: '',
  altText: '',
  ownerName: ''
});

const close = () => {
  emit('close');
};

const submit = () => {
  emit('buy', { ...form });
  // Reset form
  form.imageUrl = '';
  form.linkUrl = '';
  form.altText = '';
  form.ownerName = '';
  close();
};
</script>
