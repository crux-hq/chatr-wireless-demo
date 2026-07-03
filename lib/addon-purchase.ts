import type { AddOn } from '@/lib/mock/types';

const ADD_ON_TERM_DAYS = 30;

export function getAddOnTermDates(from = new Date()) {
  const purchasedAt = new Date(from);
  const expires = new Date(purchasedAt);
  expires.setDate(expires.getDate() + ADD_ON_TERM_DAYS);
  return {
    purchasedAt: purchasedAt.toISOString().split('T')[0],
    expiresAt: expires.toISOString().split('T')[0],
  };
}

export function getAddOnTermsKey(addOn: AddOn): string {
  switch (addOn.category) {
    case 'roaming':
      return 'addons.confirmTermsRoaming';
    case 'international-ld':
      return 'addons.confirmTermsLd';
    case 'extra-data':
      return 'addons.confirmTermsData';
    case 'talk-saver':
      return 'addons.confirmTermsTalk';
    case 'us-roaming-text':
      return 'addons.confirmTermsText';
    default:
      return 'addons.confirmTermsDefault';
  }
}
