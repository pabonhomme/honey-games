import { create } from 'zustand';
import { Reservation, User, EarnedBadge } from '@/lib/types';
import { calculateEarnedBadges } from '@/lib/utils/badge-calculator';
import { calculateCurrentStreak } from '@/lib/utils/streak-calculator';
import { generateUserStats, UserStats } from '@/lib/utils/stats-aggregator';
import { MayorStatus, calculateMayorStatus } from '@/lib/utils/mayor-calculator';
import { CostSavings, calculateUpsellOpportunity } from '@/lib/utils/upsell-calculator';

// Initial empty user to avoid null checks everywhere, or handle nulls in UI
const safeUser: User = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  memberSinceISO: new Date().toISOString(),
  accounts: [],
  membershipType: 'member',
  primaryLocation: '',
};

const initialStats: UserStats = {
  totalCheckIns: 0,
  meetingRoomCount: 0,
  dayPassCount: 0,
  officeCount: 0,
  locationsVisited: 0,
};

interface AppState {
  user: User;
  reservations: Reservation[];
  earnedBadges: EarnedBadge[];
  currentStreak: number;
  stats: UserStats;
  mayorStatus: MayorStatus;
  upsellOpportunity: CostSavings;
  isLoading: boolean;
  error: string | null;
  yearFilter: string;
  setYearFilter: (year: string) => void;
  fetchData: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: safeUser,
  reservations: [],
  earnedBadges: [],
  currentStreak: 0,
  stats: initialStats,
  mayorStatus: { isMayor: false, visitCount: 0 },
  upsellOpportunity: { totalSpentOnDayPasses: 0, potentialMembershipCost: 0, savings: 0, visits: 0 },
  isLoading: false,
  error: null,
  yearFilter: new Date().getFullYear().toString(), // Default to current year

  setYearFilter: (year: string) => {
    set({ yearFilter: year });
    get().fetchData(); // Refetch immediately when filter changes
  },

  fetchData: async () => {
    const { yearFilter } = get();
    set({ isLoading: true, error: null });
    try {
      // Fetch User and State (which contains bookings/visits) with filter
      // Note: We only filter state (transactions), user data is typically global but could be filtered too if needed.
      const [userRes, stateRes] = await Promise.all([
        fetch('/api/user'),
        fetch(`/api/state?year=${yearFilter}`)
      ]);

      if (!userRes.ok || !stateRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const userData = await userRes.json();
      const stateData = await stateRes.json();

      // Normalize backend data to frontend types
      const bookings = (stateData.bookings || []) as Reservation[];
      const visits = (stateData.visits || []) as Reservation[];
      
      const allReservations = [...bookings, ...visits];

      // Use backend badges if available, else derive? 
      const backendBadges = (stateData.badges || []) as EarnedBadge[];
      const earnedBadges = backendBadges.length > 0 ? backendBadges : calculateEarnedBadges(allReservations);

      const currentStreak = calculateCurrentStreak(allReservations);
      const stats = generateUserStats(allReservations);
      const mayorStatus = calculateMayorStatus(allReservations);
      const upsellOpportunity = calculateUpsellOpportunity(allReservations);

      set({
        user: userData || safeUser,
        reservations: allReservations,
        earnedBadges,
        currentStreak,
        stats,
        mayorStatus,
        upsellOpportunity,
        isLoading: false,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
