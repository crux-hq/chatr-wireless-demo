import { BadgeCheck, FileSearch, Receipt, Signal, Sparkles } from 'lucide-react-native';
import { CanadianFlagIcon } from '@/components/icons/CanadianFlagIcon';

export const PLAN_VALUE_PROPS = [
  { id: 'nationwide', icon: CanadianFlagIcon, custom: true as const, labelKey: 'plans.valueProps.nationwide' },
  { id: 'fast-data', icon: Signal, labelKey: 'plans.valueProps.fastData' },
  { id: 'activate', icon: Sparkles, labelKey: 'plans.valueProps.activate' },
  { id: 'no-credit', icon: BadgeCheck, labelKey: 'plans.valueProps.noCredit' },
  { id: 'no-surprises', icon: FileSearch, labelKey: 'plans.valueProps.noSurprises' },
  { id: 'no-commitment', icon: Receipt, labelKey: 'plans.valueProps.noCommitment' },
] as const;
