import * as yup from 'yup';

export const messageSchema = yup.object({
  offerId: yup
    .string()
    .required('Offer ID is required'),
  offer: yup
    .number()
    .min(1)
    .typeError('Offer must be greater than 1')
    .required('Offer is required'),
});
