import { BadgeId, BrandColor } from './enums';
import { Reservation } from './reservation';

export type BadgeCriteria = (
  reservations: Reservation[], 
  locationsVisited?: string[],
  checkIns?: { status: string, date: string }[] // Simplified check-in check
) => boolean;

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  color: BrandColor;
  isRepeatable?: boolean;
  isMemberOnly?: boolean;
  upsell?: {
    title: string;
    description: string;
    cta: string;
  };
  // criteria is functional logic, so we might keep it separate or in the object
}

export interface EarnedBadge {
  badgeId: BadgeId;
  earnedAt: string;
  count?: number;
}
