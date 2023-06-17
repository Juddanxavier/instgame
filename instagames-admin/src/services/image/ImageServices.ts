// import { LoginParams } from '@/hooks/auth/login/useLogin.types';

import { callApi } from '@/utils/apiUtils';
import imageEndpoints from '@/utils/endpoints/image';

// import { CreateTokenResponse, VerifyResponse } from './AuthServices.types';

class ImageServices {
  public getAllImages = async (keyword: any) => {
    return callApi({
      uriEndPoint: {
        ...imageEndpoints.getAllImages,
      },
      body: {
        keyword,
      },
    }).catch((error: any) => {
      throw error;
    });
  };
  public uploadImage = async (data: any) => {
    return callApi({
      uriEndPoint: {
        ...imageEndpoints.uploadImage,
      },
      body: data,
    }).catch((error: any) => {
      throw error;
    });
  };
  public updateImage = async ({ image, data }: any) => {
    return callApi({
      uriEndPoint: {
        ...imageEndpoints.updateImage,
      },
      query: {
        id: image,
      },
      body: data,
    }).catch((error: any) => {
      throw error;
    });
  };
}
export default ImageServices;
