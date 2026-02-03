import { Reservation, OpenWorkspaceReservation, EarnedBadge } from '@/lib/types';
import { BADGES } from '@/lib/constants/badges';

export function calculateEarnedBadges(reservations: Reservation[]): EarnedBadge[] {
  const earned: EarnedBadge[] = [];

  // Filter for valid check-ins
  const checkIns = reservations.filter(
    (r): r is OpenWorkspaceReservation => 
      (r as OpenWorkspaceReservation).checkInStatus === 'Checked In'
  );

  if (checkIns.length === 0) return earned;

  // 1. The New-Bee: First check-in
  if (checkIns.length > 0) {
    earned.push({
      badgeId: BADGES.NEW_BEE.id,
      earnedAt: checkIns[checkIns.length - 1].createdAt, // Mock date of earning
    });
  }

  // 2. The Pollinator: 3+ Locations in same city (Simplified: just 3 locations for now, need city data joined)
  // 5. The World Traveler: 5+ Locations in different cities
  // We need to fetch location details to check cities. 
  // For this mock implementation we will assume the reservation object includes city or we look it up.
  // Ideally, reservations should stay lightweight. We'll do a simple unique location count for both for now to demonstrate logic.
  
  const uniqueLocationIds = Array.from(new Set(reservations.map(r => r.locationId)));
  
  if (uniqueLocationIds.length >= 3) {
    earned.push({
      badgeId: BADGES.POLLINATOR.id,
      earnedAt: new Date().toISOString(),
    });
  }

  if (uniqueLocationIds.length >= 5) {
     earned.push({
      badgeId: BADGES.WORLD_TRAVELER.id,
      earnedAt: new Date().toISOString(),
    });
  }

  // 6. The Storm Rider: Date specific check-in (Mocked Snowstorm Date: Jan 15)
  const snowStormDates = ['2024-01-15', '2025-02-13']; 
  const stormSurvivor = checkIns.some(c => snowStormDates.includes(c.localStartDate));
  
  if (stormSurvivor) {
    earned.push({
      badgeId: BADGES.STORM_RIDER.id,
      earnedAt: new Date().toISOString(),
    });
  }

  // 3. The Early Riser: 5 consecutive check-ins before 8 AM
  // Sort check-ins by date
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(a.startDateISO).getTime() - new Date(b.startDateISO).getTime()
  );

  let earlyStreak = 0;
  for (const c of sortedCheckIns) {
    const date = new Date(c.startDateISO);
    const hour = date.getHours(); // Local hour assumption from ISO
    if (hour < 8) {
      earlyStreak++;
      if (earlyStreak >= 5) break; 
    } else {
      earlyStreak = 0;
    }
  }
  
  if (earlyStreak >= 5) {
    earned.push({
      badgeId: BADGES.EARLY_RISER.id,
      earnedAt: new Date().toISOString(),
    });
  }

  // 4. The Moonlighter: Working after 7 PM (19:00)
  const lateStay = reservations.some(r => {
    const end = new Date(r.endDateISO);
    return end.getHours() >= 19;
  });

  if (lateStay) {
    earned.push({
      badgeId: BADGES.MOONLIGHTER.id,
      earnedAt: new Date().toISOString(),
    });
  }

  return earned;
}
