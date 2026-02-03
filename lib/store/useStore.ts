import { create } from 'zustand';
import { Reservation, User, EarnedBadge } from '@/lib/types';
import { mockReservations } from '@/lib/mock-data/reservations';
import { mockUser } from '@/lib/mock-data/users';
import { calculateEarnedBadges } from '@/lib/utils/badge-calculator';
import { calculateCurrentStreak } from '@/lib/utils/streak-calculator';
import { generateUserStats, UserStats } from '@/lib/utils/stats-aggregator';
import { MayorStatus, calculateMayorStatus } from '@/lib/utils/mayor-calculator';
import { CostSavings, calculateUpsellOpportunity } from '@/lib/utils/upsell-calculator';

interface AppState {
  user: User;
  reservations: Reservation[];
  earnedBadges: EarnedBadge[];
  currentStreak: number;
  stats: UserStats;
  mayorStatus: MayorStatus;
  upsellOpportunity: CostSavings;
}

export const useStore = create<AppState>((set) => {
  // Initial calculation based on mock data
  const earnedBadges = calculateEarnedBadges(mockReservations);
  const currentStreak = calculateCurrentStreak(mockReservations);
  const stats = generateUserStats(mockReservations);
  const mayorStatus = calculateMayorStatus(mockReservations);
  const upsellOpportunity = calculateUpsellOpportunity(mockReservations);

  return {
    user: mockUser,
    reservations: mockReservations,
    earnedBadges,
    currentStreak,
    stats,
    mayorStatus,
    upsellOpportunity,
  };
});
