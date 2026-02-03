import { CheckInStatus } from './enums';

export interface BaseReservation {
  _id: string;
  reserverId: string;
  locationId: string;
  startDateISO: string;
  endDateISO: string;
  localStartDate: string;
  localEndDate: string;
  timezone: string;
  price: number;
  priceWithTax?: number;
  currencyIsoCode?: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
  createdAt: string;
  updatedAt?: string;
}

export interface MeetingRoomReservation extends BaseReservation {
  meetingRoomId: string;
  title?: string;
  description?: string;
  nbAttendees?: number;
}

export interface OfficeReservation extends BaseReservation {
  officeId: string;
  usesDayPasses?: boolean;
}

export interface OpenWorkspaceReservation extends BaseReservation {
  checkInStatus?: CheckInStatus;
  source?: string;
}

export type Reservation = 
  | MeetingRoomReservation 
  | OfficeReservation 
  | OpenWorkspaceReservation;
