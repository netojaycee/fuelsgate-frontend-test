import { getMaxExpiresIn } from '@/utils/getMaxExpiresIn';
import * as yup from 'yup';

export const productUploadSchema = yup.object({
  productId: yup
    .string()
    .required('Product is required'),
  depotHubId: yup
    .string()
    .required('Depot Hub is required'),
  depot: yup
    .string()
    .required('Depot is required'),
  price: yup
    .number()
    .min(1)
    .typeError('Price must be greater than 1')
    .required('Price is required'),
  volume: yup
    .number()
    .min(1)
    .typeError('Volume must be greater than 1')
    .required('Volume is required'),
  productQuality: yup
    .string()
    .nullable()
    .optional(),
  expiresIn: yup
    .number()
    .min(1)
    .max(getMaxExpiresIn())
    .typeError('Price duration must be greater than 1')
    .required('Choose the duration you want this offer to last')
});
