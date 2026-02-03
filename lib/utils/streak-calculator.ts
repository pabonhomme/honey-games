import { Reservation, OpenWorkspaceReservation } from '@/lib/types';
import { isSameDay, subDays, parseISO } from 'date-fns';

export function calculateCurrentStreak(reservations: Reservation[]): number {
  const checkIns = reservations
    .filter((r): r is OpenWorkspaceReservation => 
      (r as OpenWorkspaceReservation).checkInStatus === 'Checked In'
    )
    .sort((a, b) => new Date(b.startDateISO).getTime() - new Date(a.startDateISO).getTime()); // Descending order

  if (checkIns.length === 0) return 0;

  const today = new Date();
  
  // Check if user checked in today or yesterday to keep streak alive
  const lastCheckInDate = parseISO(checkIns[0].startDateISO);
  if (!isSameDay(lastCheckInDate, today) && !isSameDay(lastCheckInDate, subDays(today, 1))) {
    return 0;
  }

  let streak = 1;
  let currentDate = lastCheckInDate;

  // Iterate backwards to find consecutive days
  for (let i = 1; i < checkIns.length; i++) {
    const prevDate = parseISO(checkIns[i].startDateISO);
    
    if (isSameDay(prevDate, currentDate)) {
      continue; // Same day check-in, ignore
    }

    if (isSameDay(prevDate, subDays(currentDate, 1))) {
      streak++;
      currentDate = prevDate;
    } else {
      break; // Gap found
    }
  }

  return streak;
}
