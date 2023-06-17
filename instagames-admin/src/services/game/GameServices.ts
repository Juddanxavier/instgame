import { callApi } from '@/utils/apiUtils';
import gameEndpoints from '@/utils/endpoints/game';

class GameServices {
  public getAllBets = async () => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.getAllBets,
      },
    })
      .then((MenuResponse) => {
        return MenuResponse;
      })
      .catch((error: any) => {
        throw error;
      });
  };

  public getAllBetsTillNow = async ({ query }) => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.getAllBetsTillNow,
      },
      query,
    })
      .then((MenuResponse) => {
        return MenuResponse;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  public getGameSetting = async () => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.getGameSetting,
      },
    })
      .then((MenuResponse) => {
        return MenuResponse;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  public updateGameSetting = async ({ body }) => {
    return callApi({
      uriEndPoint: {
        ...gameEndpoints.updateGameSetting,
      },
      body,
    })
      .then((MenuResponse) => {
        return MenuResponse;
      })
      .catch((error: any) => {
        throw error;
      });
  };
}
export default GameServices;
