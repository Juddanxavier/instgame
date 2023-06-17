import { EndPoint } from '@/types/endpoints'

const gameEndpoints: EndPoint = {
  placeBet: {
    uri: '/game/bet',
    method: 'POST',
    version: '/api'
  },
  getGameSetting: {
    uri: '/game/gameSetting',
    method: 'GET',
    version: '/api',
  },
  getMyBetsTillNow: {
    uri: '/game/myReport',
    method: 'GET',
    version: '/api'
  },
  betList: {
    uri: '/game/bet',
    method: 'GET',
    version: '/api'
  },
  todayGames: {
    uri: '/game/todayGames',
    method: 'GET',
    version: '/api'
  }
}

export default gameEndpoints
