import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { CarouselControls } from '@/components/ui/CarouselControls';

const meta = {
  title: 'UI/CarouselControls',
  component: CarouselControls,
} satisfies Meta<typeof CarouselControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [index, setIndex] = useState(0);
    return (
      <View style={{ paddingVertical: 24 }}>
        <CarouselControls count={4} activeIndex={index} onSelect={setIndex} />
      </View>
    );
  },
};
