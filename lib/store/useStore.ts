import { create } from 'zustand';
import { Reservation, User, EarnedBadge } from '@/lib/types';
import { calculateEarnedBadges } from '@/lib/utils/badge-calculator';
import { calculateCurrentStreak } from '@/lib/utils/streak-calculator';
import { generateUserStats, UserStats } from '@/lib/utils/stats-aggregator';
import { MayorStatus, calculateMayorStatus } from '@/lib/utils/mayor-calculator';
import { CostSavings, calculateUpsellOpportunity } from '@/lib/utils/upsell-calculator';

// Initial empty user to avoid null checks everywhere
const safeUser: User = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  memberSinceISO: new Date().toISOString(),
  accounts: [],
  membershipType: 'member',
  primaryLocation: '',
  activityPoints: 0,
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
  refreshState: () => Promise<void>; // Alias for fetchData
  redeemItem: (item: { id: string; cost: number; name: string }) => Promise<boolean>;
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
  yearFilter: new Date().getFullYear().toString(), 

  setYearFilter: (year: string) => {
    set({ yearFilter: year });
    get().fetchData(); 
  },

  refreshState: async () => {
      await get().fetchData();
  },

  fetchData: async () => {
    const { yearFilter } = get();
    set({ isLoading: true, error: null });
    try {
      // Direct call to demo backend if proxy not set, or relative if proxy is set.
      // Assuming localhost:4000 for demo backend based on server.js
      const baseUrl = 'http://localhost:4000'; 
      
      const stateRes = await fetch(`${baseUrl}/state?year=${yearFilter}`);

      if (!stateRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const stateData = await stateRes.json();

      // Normalize backend data to frontend types
      const bookings = (stateData.bookings || []) as Reservation[];
      const visits = (stateData.visits || []) as Reservation[];
      
      const allReservations = [...bookings, ...visits];

      // Merge user data properly
      // If we are using the demo backend directly via proxy:
      const backendUser = stateData.users ? stateData.users['user-123'] : {};
      const finalUser = { ...safeUser, ...backendUser };

      // Use backend badges if available
      const backendBadges = finalUser.earnedBadges || stateData.badges || [];
      const earnedBadges = backendBadges.length > 0 ? backendBadges : calculateEarnedBadges(allReservations);

      // Use backend streak if available, else calculate
      const currentStreak = finalUser.daysStreak !== undefined ? finalUser.daysStreak : calculateCurrentStreak(allReservations);
      
      const stats = generateUserStats(allReservations);
      const mayorStatus = calculateMayorStatus(allReservations);
      const upsellOpportunity = calculateUpsellOpportunity(allReservations);

      set({
        user: finalUser,
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

  redeemItem: async (item) => {
      try {
          const res = await fetch('http://localhost:4000/actions/redeem', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ itemId: item.id, cost: item.cost, name: item.name })
          });
          const data = await res.json();
          if (data.success) {
              await get().fetchData(); 
              return true;
          }
          return false;
      } catch (e) {
          console.error(e);
          return false;
      }
  }
}));
