import type { Preview } from '@storybook/vue3'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    interactions: {
      disable: false,
      autoPlay: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
}

export default preview
