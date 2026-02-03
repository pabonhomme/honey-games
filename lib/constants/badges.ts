import { Badge } from '@/lib/types';

export const BADGES: Record<string, Badge> = {
  NEW_BEE: {
    id: 'new-bee',
    name: 'The New-Bee',
    description: 'First check-in as a member',
    icon: '🐝',
    color: 'honey',
  },
  EARLY_RISER: {
    id: 'early-riser',
    name: 'The Early Riser',
    description: 'Checked in before 8:00 AM five days in a row',
    icon: '🌅',
    color: 'ocean',
  },
  MOONLIGHTER: {
    id: 'moonlighter',
    name: 'The Moonlighter',
    description: 'Still working after 7:00 PM',
    icon: '🌙',
    color: 'teal',
  },
  ANCHOR: {
    id: 'anchor',
    name: 'The Anchor',
    description: 'Visited the same desk or zone for 10 consecutive workdays',
    icon: '⚓',
    color: 'teal',
  },
  FULL_HOUSE: {
    id: 'full-house',
    name: 'The Full House',
    description: 'Checked in every single business day of a calendar month',
    icon: '🏠',
    color: 'honey',
  },
  BUSY_BEE: {
    id: 'busy-bee',
    name: 'The Busy Bee',
    description: 'Attended three community-led events',
    icon: '🐝',
    color: 'honey',
  },
  CONNECTOR: {
    id: 'connector',
    name: 'The Connector',
    description: 'Successfully referred a new member or a guest',
    icon: '🤝',
    color: 'ocean',
  },
  POLLINATOR: {
    id: 'pollinator',
    name: 'The Pollinator',
    description: 'Visited 3+ Industrious locations within a city',
    icon: '🦋',
    color: 'sunset',
  },
  WORLD_TRAVELER: {
    id: 'world-traveler',
    name: 'The World Traveler',
    description: 'Visited 5+ locations in different cities',
    icon: '🌍',
    color: 'teal',
  },
  STORM_RIDER: {
    id: 'storm-rider',
    name: 'The Storm Rider',
    description: 'Braved the elements during a snowstorm',
    icon: '❄️',
    color: 'grey',
  },
};
