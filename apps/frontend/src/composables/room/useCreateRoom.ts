import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

// コンポーザブルの戻り値の型
export type UseCreateRoomReturnType = {
  isLoading: Ref<boolean>
  error: Ref<string>
  createRoom: () => Promise<void>
}

// コンポーザブル関数自体の型
export type UseCreateRoomType = () => UseCreateRoomReturnType

export const useCreateRoom: UseCreateRoomType = () => {
  // const router = useRouter()
  const isLoading = ref(false)
  const error = ref('')

  const createRoom = async () => {
    isLoading.value = true
    error.value = ''
    // debug: sleep 1 seconds
    console.log('useCreateRoom')
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // TODO: APIを呼び出して部屋を作成する
      // const response = await createRoomAPI()
      // const roomId = response.roomId
      const roomId = 'dummy-room-id' // 仮実装

      // TODO: ページ遷移するかポップアップでURLとページ遷移用ボタンを表示するか
      // 検討してから実装する
      // router.push(`/room/${roomId}`)
    } catch (e) {
      error.value = '部屋の作成に失敗しました。もう一度お試しください。'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    createRoom,
  }
}

export const useCreateRoomMock = (isLoading = false, error = '', createRoom: () => {}) => {
  return {
    isLoading,
    error,
    createRoom,
  }
}
