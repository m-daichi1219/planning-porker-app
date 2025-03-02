import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useCreateRoom = () => {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref('')

  const createRoom = async () => {
    isLoading.value = true
    error.value = ''
    
    try {
      // TODO: APIを呼び出して部屋を作成する
      // const response = await createRoomAPI()
      // const roomId = response.roomId
      const roomId = 'dummy-room-id' // 仮実装
      
      router.push(`/room/${roomId}`)
    } catch (e) {
      error.value = '部屋の作成に失敗しました。もう一度お試しください。'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    createRoom
  }
} 