import { DepotHubDto } from "./depot-hub.types";
import { ProductDto } from "./product.types";

export type ProductUploadStatus = 'active' | 'expired';

export type ProductUploadDto = {
  _id?: string
  sellerId?: string | any
  productId: string | ProductDto
  depotHubId: string | DepotHubDto
  depot: string
  volume: number
  price: number
  expiresIn: number
  productQuality?: string | null
  status: ProductUploadStatus
}