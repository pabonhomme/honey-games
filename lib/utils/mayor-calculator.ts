import { Reservation, OpenWorkspaceReservation } from '@/lib/types';

export interface MayorStatus {
  isMayor: boolean;
  locationId?: string;
  locationName?: string;
  visitCount: number;
}

export function calculateMayorStatus(reservations: Reservation[]): MayorStatus {
  // 1. Group check-ins by location
  const locationCounts: Record<string, number> = {};
  
  reservations.forEach(r => {
    if ((r as OpenWorkspaceReservation).checkInStatus === 'Checked In') {
      locationCounts[r.locationId] = (locationCounts[r.locationId] || 0) + 1;
    }
  });

  // 2. Find max visited location
  let maxLocationId = '';
  let maxCount = 0;

  Object.entries(locationCounts).forEach(([id, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxLocationId = id;
    }
  });

  // 3. Determine threshold (e.g., > 5 visits)
  const MAYOR_THRESHOLD = 5; 

  if (maxCount >= MAYOR_THRESHOLD) {
    return {
      isMayor: true,
      locationId: maxLocationId,
      visitCount: maxCount,
      locationName: 'Mock Location Name'
    };
  }

  return {
    isMayor: false,
    visitCount: 0
  };
}
