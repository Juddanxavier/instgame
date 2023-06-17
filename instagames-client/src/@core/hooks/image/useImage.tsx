import { useMutation } from 'react-query'

import ImageServices from '@/services/image/ImageServices'

const { uploadImage, getAllImages } = new ImageServices()

export function useGetAllImages() {
  return useMutation((keyword: any) => getAllImages(keyword))
}

export function useUploadImage() {
  return useMutation((data: any) => uploadImage(data))
}
