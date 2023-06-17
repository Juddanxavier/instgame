import { atom } from 'jotai';

interface Party {
  partyId: string;
}
interface AuthState {
  party?: Party;
  isAuthenticated: boolean;
}

// Create your atoms and derivatives
export const authAtom = atom<AuthState>({
  isAuthenticated: false,
});
