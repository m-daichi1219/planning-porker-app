import type { Meta, StoryObj } from '@storybook/vue3'
import CreateRoom from '@/views/CreateRoom.vue'
import { provide, ref } from 'vue'
import { fn } from '@storybook/test'
import { useCreateRoomMock } from '@/composables/room/useCreateRoom'

const meta = {
  title: 'Views/CreateRoom',
  component: CreateRoom,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CreateRoom>

export default meta
type Story = StoryObj<typeof meta>

// 通常の表示状態
export const Default: Story = {
  render: () => ({
    components: { CreateRoom },
    setup() {
      provide('useCreateRoom', () => useCreateRoomMock())
      return {}
    },
    template: '<CreateRoom />',
  }),
}

// ローディング中の状態
export const Loading: Story = {
  render: () => ({
    components: { CreateRoom },
    setup() {
      provide('useCreateRoom', () => useCreateRoomMock(true))
      return {}
    },
    template: '<CreateRoom />',
  }),
}

// エラー表示の状態
export const Error: Story = {
  render: () => ({
    components: { CreateRoom },
    setup() {
      provide('useCreateRoom', () =>
        useCreateRoomMock(false, '部屋の作成に失敗しました。もう一度お試しください。'),
      )
      return {}
    },
    template: '<CreateRoom />',
  }),
}
