import { useMutation } from 'react-query'

import GameService from '@/services/game/GameServices'

const { placeBet, getBetList, todayGames, getGameSetting, getMyBetsTillNow } = new GameService()

export function usePlaceBet() {
  return useMutation((payload: any) => placeBet(payload))
}

export function useGetBetList() {
  return useMutation(() => getBetList())
}
export function useGetTodayGames() {
  return useMutation(() => todayGames())
}

export function useGetMyGameSetting() {
  return useMutation(() => getGameSetting())
}

export function useGetMyBetsTillNow() {
  return useMutation((payload: any) => getMyBetsTillNow(payload))
}
