import { User } from '@/lib/types';

export const mockUser: User = {
  _id: 'user-123',
  firstName: 'Jordan',
  lastName: 'Member',
  email: 'jordan@example.com',
  profilePictureUrl: 'https://avatar.vercel.sh/jordan',
  memberSinceISO: '2023-01-15T00:00:00.000Z',
  accounts: [
    { _id: 'acc-1', name: 'Acme Corp' }
  ]
};
