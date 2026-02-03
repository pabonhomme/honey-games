import { Reservation } from '@/lib/types';

export const MEMBERSHIP_COST = 570; // Monthly

export interface CostSavings {
  totalSpentOnDayPasses: number;
  potentialMembershipCost: number; // Assuming 1 month for simple comparison or annual
  savings: number;
  visits: number;
}

export function calculateUpsellOpportunity(reservations: Reservation[]): CostSavings {
  // Calculate total spend on Day Passes (Open Workspace) in the current year
  const currentYear = new Date().getFullYear();
  
  const dayPasses = reservations.filter(r => {
    const isDayPass = !('meetingRoomId' in r) && !('officeId' in r);
    const isThisYear = new Date(r.startDateISO).getFullYear() === currentYear;
    return isDayPass && isThisYear;
  });

  const totalSpent = dayPasses.reduce((sum, r) => sum + r.price, 0);
  
  // Simple logic: Compare annual spend vs One Month Membership (for the "You spent X, membership is Y" msg) 
  // In reality, we'd compare Annual Spend vs Annual Membership, or Monthly Average.
  // The user prompt example: "You visited 23 times this year. You spent 690$. A monthly membership would have cost 570$."
  // This implies comparing Total Annual Spend vs 1 Month Membership Cost to show immediate value? 
  // Or maybe it means "A monthly membership [for that month] would have cost..." 
  
  return {
    totalSpentOnDayPasses: totalSpent,
    potentialMembershipCost: MEMBERSHIP_COST,
    savings: totalSpent - MEMBERSHIP_COST,
    visits: dayPasses.length
  };
}
