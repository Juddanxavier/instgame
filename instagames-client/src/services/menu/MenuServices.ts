import { callApi } from '@/utils/apiUtils';
import menuEndpoints from '@/utils/endpoints/menu';

class MenuServices {
  public getMenu = async () => {
    return callApi({
      uriEndPoint: {
        ...menuEndpoints.getMenu,
      },
    })
      .then((MenuResponse) => {
        return MenuResponse;
      })
      .catch((error: any) => {
        throw error;
      });
  };
}
export default MenuServices;
