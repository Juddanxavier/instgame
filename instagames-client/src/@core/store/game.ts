import { atom } from 'jotai'

interface Game {
  gameStatus: boolean
  gameId: string
  recentWinner: number
  allBetListSet: AllBetListSet[]
  grandTotal: number
  offTime: number | null
}

export interface AllBetListSet {
  number: number
  totalBet: number
}

export interface NewBet {
  _id: string
  user: string
  game: string
  betAmount: number
  betNumber: number
  createdAt: Date
  updatedAt: Date
  __v: number
}

export interface BetList {
  type: string
  status: string
  message: string
  newBet: NewBet
}

// Create your atoms and derivatives
export const gameAtom = atom<Game | null>(null)
export const betAtom = atom<NewBet[] | null>(null)
export const gameTimerAtom = atom<number | null>(null)
