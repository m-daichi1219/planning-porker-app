<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useCreateRoom } from '@/composables/room/useCreateRoom'
import { provide } from 'vue'
import { createRoomKey } from './composables/room/types'

provide(createRoomKey, useCreateRoom)
</script>

<template>
  <div class="min-h-screen">
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
