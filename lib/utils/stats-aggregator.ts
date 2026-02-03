import { Reservation, MeetingRoomReservation, OfficeReservation, OpenWorkspaceReservation } from '@/lib/types';

export interface UserStats {
  meetingRoomCount: number;
  dayPassCount: number;
  officeCount: number;
  locationsVisited: number;
  totalCheckIns: number;
}

export function generateUserStats(reservations: Reservation[]): UserStats {
  const stats: UserStats = {
    meetingRoomCount: 0,
    dayPassCount: 0,
    officeCount: 0,
    locationsVisited: 0,
    totalCheckIns: 0,
  };

  const uniqueLocations = new Set<string>();

  reservations.forEach(r => {
    uniqueLocations.add(r.locationId);

    if ('meetingRoomId' in r) {
      stats.meetingRoomCount++;
    } else if ('officeId' in r) {
      stats.officeCount++;
    } else {
      // Open Workspace / Day Pass
      stats.dayPassCount++;
      if ((r as OpenWorkspaceReservation).checkInStatus === 'Checked In') {
        stats.totalCheckIns++;
      }
    }
  });

  stats.locationsVisited = uniqueLocations.size;
  return stats;
}
