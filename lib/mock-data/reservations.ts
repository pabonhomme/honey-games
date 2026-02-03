import { addDays, subDays, setHours } from 'date-fns';
import { Reservation, MeetingRoomReservation, OpenWorkspaceReservation } from '@/lib/types';

const today = new Date();

export const mockReservations: Reservation[] = [
  // Recent check-in (Today)
  {
    _id: 'res-1',
    reserverId: 'user-123',
    locationId: 'loc-nyc-flatiron',
    startDateISO: setHours(today, 9).toISOString(),
    endDateISO: setHours(today, 17).toISOString(),
    localStartDate: today.toISOString().split('T')[0], // simplistic local date
    localEndDate: today.toISOString().split('T')[0],
    timezone: 'America/New_York',
    price: 45,
    status: 'Confirmed',
    checkInStatus: 'Checked In',
    source: 'MemberPortal',
    createdAt: subDays(today, 2).toISOString(),
  } as OpenWorkspaceReservation,

  // Early riser check-in (Yesterday 7:00 AM)
  {
    _id: 'res-2',
    reserverId: 'user-123',
    locationId: 'loc-nyc-flatiron',
    startDateISO: setHours(subDays(today, 1), 7).toISOString(),
    endDateISO: setHours(subDays(today, 1), 16).toISOString(),
    localStartDate: subDays(today, 1).toISOString().split('T')[0],
    localEndDate: subDays(today, 1).toISOString().split('T')[0],
    timezone: 'America/New_York',
    price: 45,
    status: 'Confirmed',
    checkInStatus: 'Checked In',
    createdAt: subDays(today, 3).toISOString(),
  } as OpenWorkspaceReservation,

  // Meeting Room
  {
    _id: 'res-3',
    reserverId: 'user-123',
    locationId: 'loc-nyc-flatiron',
    meetingRoomId: 'room-abc',
    title: 'Client Strategy',
    startDateISO: setHours(subDays(today, 2), 14).toISOString(),
    endDateISO: setHours(subDays(today, 2), 15).toISOString(),
    localStartDate: subDays(today, 2).toISOString().split('T')[0],
    localEndDate: subDays(today, 2).toISOString().split('T')[0],
    timezone: 'America/New_York',
    price: 75,
    status: 'Confirmed',
    nbAttendees: 4,
    createdAt: subDays(today, 5).toISOString(),
  } as MeetingRoomReservation,

  // Another Location (SF)
  {
    _id: 'res-4',
    reserverId: 'user-123',
    locationId: 'loc-sf-soma',
    startDateISO: setHours(subDays(today, 10), 9).toISOString(),
    endDateISO: setHours(subDays(today, 10), 17).toISOString(),
    localStartDate: subDays(today, 10).toISOString().split('T')[0],
    localEndDate: subDays(today, 10).toISOString().split('T')[0],
    timezone: 'America/Los_Angeles',
    price: 45,
    status: 'Confirmed',
    checkInStatus: 'Checked In',
    createdAt: subDays(today, 12).toISOString(),
  } as OpenWorkspaceReservation
];
