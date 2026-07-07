import type { Preview } from '@storybook/react-native-web-vite';
import { colors } from '@/lib/theme/colors';
import { AppDecorator } from './decorators';

const preview: Preview = {
  decorators: [AppDecorator],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: colors.gray },
        { name: 'white', value: colors.white },
        { name: 'primary', value: colors.primary },
        { name: 'lavender', value: colors.lavenderLight },
      ],
    },
    docs: {
      toc: true,
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
