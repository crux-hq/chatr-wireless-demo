import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PlansBrowse } from '@/components/plans/PlansBrowse';
import { AddOnsBrowse } from '@/components/addons/AddOnsBrowse';
import { FullWidthDecorator } from '../../.storybook/decorators';

const meta = {
  title: 'Browse/PlansBrowse',
  decorators: [FullWidthDecorator],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const PublicPlans: StoryObj = {
  render: () => (
    <View style={{ flex: 1, minHeight: 720 }}>
      <PlansBrowse variant="public" />
    </View>
  ),
};

export const AuthenticatedAddOns: StoryObj = {
  render: () => (
    <View style={{ flex: 1, minHeight: 720 }}>
      <AddOnsBrowse variant="authenticated" />
    </View>
  ),
};
