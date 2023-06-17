import { useMutation } from 'react-query';

import GameServices from '@/services/game/GameServices';

const { getAllBets, getAllBetsTillNow, getGameSetting, updateGameSetting } =
  new GameServices();

export function useGetAllBets() {
  return useMutation(() => getAllBets());
}

export function useGetAllBetsTillNow() {
  return useMutation((payload: any) => getAllBetsTillNow(payload));
}

export function useGetMyGameSetting() {
  return useMutation(() => getGameSetting());
}

export function useUpdateGameSetting() {
  return useMutation((payload: any) => updateGameSetting(payload));
}
