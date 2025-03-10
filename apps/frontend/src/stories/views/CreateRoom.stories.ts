import type { Meta, StoryObj } from '@storybook/vue3'
import CreateRoom from '@/views/CreateRoom.vue'
import { provide, ref } from 'vue'
import { fn, userEvent, within, expect } from '@storybook/test'
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

// モック関数を作成
const createMockRoom = fn()

// 通常の表示状態
export const Default: Story = {
  render: () => ({
    components: { CreateRoom },
    setup() {
      provide('useCreateRoom', {
        isLoading: ref(false),
        error: ref(''),
        createRoom: createMockRoom,
      })
      return {}
    },
    template: '<CreateRoom />',
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    // ボタンが表示されていることを確認
    await step('ボタンが表示されていることを確認', async () => {
      const button = canvas.getByRole('button', { name: /部屋を作成する/i })
      expect(button).toBeTruthy()
    })

    // ボタンをクリック
    await step('ボタンをクリックして部屋作成処理が呼ばれることを確認', async () => {
      const button = canvas.getByRole('button', { name: /部屋を作成する/i })
      await userEvent.click(button)

      // createRoom関数が呼ばれたことを確認
      expect(createMockRoom).toHaveBeenCalled()
    })
  },
}

// ローディング中の状態
export const Loading: Story = {
  render: () => ({
    components: { CreateRoom },
    setup() {
      provide('useCreateRoom', () => useCreateRoomMock(true, '', () => fn()))
      return {}
    },
    template: '<CreateRoom />',
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('ローディング状態のボタンが表示されていることを確認', async () => {
      const button = canvas.getByRole('button', { name: /作成中/i })
      expect(button).toBeTruthy()
      expect(button).toBeDisabled()
    })
  },
}

// エラー表示の状態
export const Error: Story = {
  render: () => ({
    components: { CreateRoom },
    setup() {
      provide('useCreateRoom', () =>
        useCreateRoomMock(false, '部屋の作成に失敗しました。もう一度お試しください。', () => fn()),
      )
      return {}
    },
    template: '<CreateRoom />',
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('エラーメッセージが表示されていることを確認', async () => {
      const errorMessage = canvas.getByText(/部屋の作成に失敗しました/i)
      expect(errorMessage).toBeTruthy()
    })
  },
}
