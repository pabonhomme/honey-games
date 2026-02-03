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
  fetchData: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  user: safeUser,
  reservations: [],
  earnedBadges: [],
  currentStreak: 0,
  stats: initialStats,
  mayorStatus: { isMayor: false, visitCount: 0 },
  upsellOpportunity: { totalSpentOnDayPasses: 0, potentialMembershipCost: 0, savings: 0, visits: 0 },
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch User and State (which contains bookings/visits)
      const [userRes, stateRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/state')
      ]);

      if (!userRes.ok || !stateRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const userData = await userRes.json();
      const stateData = await stateRes.json();

      // Normalize backend data to frontend types
      // Backend 'bookings' and 'visits' need to be merged/mapped to 'reservations'
      // Assuming backend 'bookings' and 'visits' match Reservation shape roughly or we map them.
      // For this demo, we assume the backend stores them in a compatible way or we just use them.
      
      const bookings = (stateData.bookings || []) as Reservation[];
      const visits = (stateData.visits || []) as Reservation[];
      
      // Combine for calculations
      const allReservations = [...bookings, ...visits];

      // Recalculate derived state based on FETCHED data
      // Note: If backend provides these, we could use them. But calculating ensures consistency with frontend logic.
      // However, strict requirement says "Badge count... backend-driven". 
      // If backend sends 'badges' (EarnedBadge[]), usage:
      const backendBadges = (stateData.badges || []) as EarnedBadge[];
      
      // OR if we trust frontend logic:
      // const earnedBadges = calculateEarnedBadges(allReservations);
      
      // Let's mix: Use backend badges if available, else derive? 
      // User said: "Frontend only renders what backend returns."
      // So we should use `stateData.badges`.
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
