<template>
  <div class="create-room">
    <h1 class="title">Planning Poker</h1>

    <div class="description">
      <p>プランニングポーカーは、チームでタスクの見積もりを行うための手法です。</p>
      <p>
        各メンバーが独立して見積もりを出し、結果を共有・議論することで、より正確な合意を得ることができます。
      </p>
    </div>

    <div class="create-section">
      <button class="create-button" :disabled="isLoading" @click="createRoom">
        {{ isLoading ? '作成中...' : '部屋を作成する' }}
      </button>
      <p v-if="error" class="error-message">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createRoomKey } from '@/composables/room/types'
import { inject } from 'vue'

const useCreateRoomComposable = inject(createRoomKey)
if (!useCreateRoomComposable) throw new Error('useCreateRoomComposable is not provided')

const { isLoading, error, createRoom } = useCreateRoomComposable()
</script>

<style scoped>
.create-room {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.description {
  margin-bottom: 3rem;
  line-height: 1.6;
}

.create-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-button:hover:not(:disabled) {
  background-color: #3aa876;
}

.create-button:disabled {
  background-color: #a8a8a8;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
}
</style>
