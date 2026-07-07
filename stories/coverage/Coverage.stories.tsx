import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { CoverageResultCard } from '@/components/coverage/CoverageResultCard';
import { COVERAGE_SEARCH_RESULTS } from '@/lib/mock/coverage';

const meta = {
  title: 'Coverage/CoverageResultCard',
  component: CoverageResultCard,
} satisfies Meta<typeof CoverageResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const toronto = COVERAGE_SEARCH_RESULTS[0];
const limited = COVERAGE_SEARCH_RESULTS.find((r) => !r.nationWide) ?? COVERAGE_SEARCH_RESULTS[0];

export const Excellent: Story = {
  args: { result: toronto },
};

export const Limited: Story = {
  args: { result: limited },
};
