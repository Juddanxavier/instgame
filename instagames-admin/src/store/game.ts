import { atom } from 'jotai';

export interface Game {
  gameStatus: boolean;
  gameId: string;
  gameId2: string;
  allBetListSet: AllBetListSet[];
  grandTotal: number;
  offTime: number | null;
}

export interface AllBetListSet {
  number: number;
  totalBet: number;
}

// Create your atoms and derivatives
export const gameAtom = atom<Game | null>({
  gameStatus: false,
  gameId: '',
  gameId2: '',
  allBetListSet: [],
  grandTotal: 0,
  offTime: null,
});

export const gameTimerAtom = atom<number | null>(null);
