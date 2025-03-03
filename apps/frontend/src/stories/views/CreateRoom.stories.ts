import type { Meta, StoryObj } from '@storybook/vue3'
import CreateRoom from '@/views/CreateRoom.vue'
import { ref } from 'vue'
import { fn } from '@storybook/test'

// useCreateRoomは外部APIを実行するためモックを利用する
const mockUseCreateRoom = {
  useCreateRoom: () => ({
    isLoading: ref(false),
    error: ref(''),
    createRoom: fn(),
  }),
}

const meta = {
  title: 'Views/CreateRoom',
  component: CreateRoom,
  parameters: {
    layout: 'fullscreen',
    mockData: mockUseCreateRoom,
  },
} satisfies Meta<typeof CreateRoom>

export default meta
type Story = StoryObj<typeof meta>

// 通常の表示状態
export const Default: Story = {
  args: {},
}

// ローディング中の状態
export const Loading: Story = {
  args: {
    // ローディング状態の props
  },
  parameters: {
    mockData: {
      useCreateRoom: () => ({
        isLoading: ref(true),
        error: ref(''),
        createRoom: fn(),
      }),
    },
  },
}

// エラー表示の状態
export const Error: Story = {
  args: {
    // エラー状態の props
  },
  parameters: {
    mockData: {
      useCreateRoom: () => ({
        isLoading: ref(false),
        error: ref('部屋の作成に失敗しました。もう一度お試しください。'),
        createRoom: fn(),
      }),
    },
  },
}
