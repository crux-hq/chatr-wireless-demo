import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { AddOnPurchaseConfirmDialog } from '@/components/addons/AddOnPurchaseConfirmDialog';
import { AddOnPurchaseSuccessDialog } from '@/components/addons/AddOnPurchaseSuccessDialog';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { sampleAddOn } from '../fixtures';

const meta = {
  title: 'Add-ons/Dialogs',
} satisfies Meta;

export default meta;

export const Confirm: StoryObj = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    if (!sampleAddOn) return null;
    return (
      <AddOnPurchaseConfirmDialog
        visible={visible}
        addOn={sampleAddOn}
        locale="en"
        onClose={() => setVisible(false)}
        onConfirm={() => setVisible(false)}
      />
    );
  },
};

export const Success: StoryObj = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <AddOnPurchaseSuccessDialog
        visible={visible}
        addOnName="Extra 5 GB"
        expiresAt="2026-08-01"
        locale="en"
        onClose={() => setVisible(false)}
        onViewAccount={() => setVisible(false)}
      />
    );
  },
};

export const Setup: StoryObj = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <AddOnSetupDialog
        visible={visible}
        onClose={() => setVisible(false)}
        onActivate={() => setVisible(false)}
        onSignIn={() => setVisible(false)}
      />
    );
  },
};
