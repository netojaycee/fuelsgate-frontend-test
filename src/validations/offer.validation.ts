import * as yup from 'yup';

export const offerSchema = yup.object({
  productUploadId: yup
    .string()
    .required('Product ID is required'),
  receiverId: yup
    .string()
    .required('Receiver ID is required'),
  offer: yup
    .number()
    .min(1)
    .typeError('Offer must be greater than 1')
    .required('Offer is required'),
  volume: yup
    .number()
    .required('Volume is required')
});
