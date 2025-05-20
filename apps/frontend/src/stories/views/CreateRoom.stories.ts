import type { Meta, StoryObj } from '@storybook/vue3'
import CreateRoom from '@/views/createRoom.vue'
import { provide } from 'vue'
import { fn, userEvent, within, expect } from '@storybook/test'
import { useCreateRoomMock } from '@/composables/room/useCreateRoom'
import { createRoomKey } from '@/composables/room/types'

const meta = {
  title: 'Views/部屋作成画面',
  component: CreateRoom,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CreateRoom>

export default meta
type Story = StoryObj<typeof meta>

const createMockRoom = fn()
// 通常の表示状態
export const Default: Story = {
  render: () => ({
    components: { CreateRoom },
    setup() {
      provide(createRoomKey, () => useCreateRoomMock(false, '', createMockRoom))
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
      provide(createRoomKey, () => useCreateRoomMock(true, '', () => {}))
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
      provide(createRoomKey, () =>
        useCreateRoomMock(false, '部屋の作成に失敗しました。もう一度お試しください。', () => {}),
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
