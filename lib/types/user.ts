export interface Account {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  memberSinceISO: string;
  accounts: Account[];
}
