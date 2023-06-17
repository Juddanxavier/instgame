import { EndPoint } from '@/types/endpoints'

const imageEndpoints: EndPoint = {
  getAllImages: {
    uri: '/image/getImages',
    method: 'POST',
    version: '/api'
  },
  uploadImage: {
    uri: '/image/uploadImage',
    method: 'POST',
    version: '/api'
  },
  updateImage: {
    uri: '/image/updateImage',
    method: 'POST',
    version: '/api'
  },
  verifyAuthToken: {
    uri: '/image/verifyAuthToken',
    method: 'POST',
    version: '/api'
  }
}

export default imageEndpoints
