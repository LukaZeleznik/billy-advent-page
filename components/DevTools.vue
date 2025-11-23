<template>
  <div class="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-gray-800">Dev Tools</h3>
      <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-mono">DEBUG</span>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Simulate Date</label>
        <div class="flex gap-2">
          <select v-model="selectedMonth" class="flex-1 text-sm border rounded p-1">
            <option :value="10">Nov</option>
            <option :value="11">Dec</option>
            <option :value="0">Jan</option>
          </select>
          <input 
            v-model.number="selectedDay" 
            type="number" 
            min="1" 
            max="31" 
            class="w-16 text-sm border rounded p-1"
          />
        </div>
      </div>

      <div class="pt-2 border-t border-gray-100">
        <div class="text-xs text-gray-400 mb-2">
          Current: {{ currentDate.toLocaleDateString() }}
        </div>
        <button 
          @click="handleClear"
          class="w-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold py-1 px-2 rounded transition-colors"
        >
          Clear Database
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdStore } from '~/composables/useAdStore';

const { currentDate, setCurrentDate, clearAds } = useAdStore();

const selectedMonth = ref(currentDate.value.getMonth());
const selectedDay = ref(currentDate.value.getDate());

watch([selectedMonth, selectedDay], () => {
  const newDate = new Date();
  newDate.setMonth(selectedMonth.value);
  newDate.setDate(selectedDay.value);
  setCurrentDate(newDate);
});

const handleClear = async () => {
  if (confirm('Are you sure you want to delete ALL ads? This cannot be undone.')) {
    await clearAds();
  }
};
</script>
