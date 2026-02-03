import { Location } from '@/lib/types';

export const mockLocations: Location[] = [
  {
    _id: 'loc-nyc-flatiron',
    sfId: 'a0x1234567890',
    name: 'Flatiron',
    address: '902 Broadway',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    timezone: 'America/New_York',
    products: {
      meetingRoom: { availableAtLocation: true, currentlySellable: true },
      coworkingDayPass: { availableAtLocation: true, currentlySellable: true },
      dedicatedOffice: { availableAtLocation: true, currentlySellable: true },
    },
  },
  {
    _id: 'loc-sf-soma',
    sfId: 'a0x1234567891',
    name: 'SoMa',
    address: '564 Market Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    timezone: 'America/Los_Angeles',
    products: {
      meetingRoom: { availableAtLocation: true, currentlySellable: true },
      coworkingDayPass: { availableAtLocation: true, currentlySellable: true },
    },
  },
  {
    _id: 'loc-chi-fulton',
    sfId: 'a0x1234567892',
    name: 'Fulton Market',
    address: '917 W Washington Blvd',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    timezone: 'America/Chicago',
    products: {
      meetingRoom: { availableAtLocation: true, currentlySellable: true },
      coworkingDayPass: { availableAtLocation: true, currentlySellable: true },
    },
  },
  {
    _id: 'loc-dal-arts',
    sfId: 'a0x1234567893',
    name: 'Arts District',
    address: '1722 Routh Street',
    city: 'Dallas',
    state: 'TX',
    country: 'USA',
    timezone: 'America/Chicago',
    products: {
      meetingRoom: { availableAtLocation: true, currentlySellable: true },
      coworkingDayPass: { availableAtLocation: true, currentlySellable: true },
    },
  }
];
