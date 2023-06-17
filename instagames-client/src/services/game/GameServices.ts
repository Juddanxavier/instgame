import { callApi } from '@/utils/apiUtils'
import gameEndpoints from '@/utils/endpoints/game'

class GameServices {
  public placeBet = async (payload: any) => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.placeBet
      },
      body: payload
    })
      .then(MenuResponse => {
        return MenuResponse
      })
      .catch((error: any) => {
        throw error
      })
  }
  public getGameSetting = async () => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.getGameSetting
      }
    })
      .then(MenuResponse => {
        return MenuResponse
      })
      .catch((error: any) => {
        throw error
      })
  }
  public getMyBetsTillNow = async ({ query }: any) => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.getMyBetsTillNow
      },
      query
    })
      .then(MenuResponse => {
        return MenuResponse
      })
      .catch((error: any) => {
        throw error
      })
  }
  public getBetList = async () => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.betList
      }
    })
      .then(MenuResponse => {
        return MenuResponse
      })
      .catch((error: any) => {
        throw error
      })
  }
  public todayGames = async () => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.todayGames
      }
    })
      .then(MenuResponse => {
        return MenuResponse
      })
      .catch((error: any) => {
        throw error
      })
  }
}
export default GameServices
