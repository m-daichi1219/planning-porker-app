<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { useCreateRoom } from '@/composables/room/useCreateRoom'
import { provide } from 'vue'

const isDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

watch(isDark, (newValue) => {
  document.documentElement.classList.toggle('dark', newValue)
})

provide('useCreateRoom', useCreateRoom)
</script>

<template>
  <div class="min-h-screen">
    <button 
      @click="isDark = !isDark"
      class="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
    >
      {{ isDark ? '🌙' : '☀️' }}
    </button>
    <RouterView />
  </div>
</template>

<style>
:root {
  color-scheme: light dark;
}

.dark {
  --color-background: var(--vt-c-black);
  --color-background-soft: var(--vt-c-black-soft);
  --color-background-mute: var(--vt-c-black-mute);
  --color-heading: var(--vt-c-text-dark-1);
  --color-text: var(--vt-c-text-dark-2);
}
</style>
