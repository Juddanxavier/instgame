import { EndPoint } from '@/types/endpoints';

const gameEndpoints: EndPoint = {
  getAllBets: {
    uri: '/game/allBets',
    method: 'GET',
    version: '/api',
  },
  getAllBetsTillNow: {
    uri: '/game/report',
    method: 'GET',
    version: '/api',
  },
  getGameSetting: {
    uri: '/game/gameSetting',
    method: 'GET',
    version: '/api',
  },
  updateGameSetting: {
    uri: '/game/gameSetting',
    method: 'PUT',
    version: '/api',
  },
};

export default gameEndpoints;
