import * as yup from 'yup';



export const truckOfferSchema = yup.object({
  truckOrderId: yup
    .string()
    .required('Product ID is required'),
  // receiverId: yup
  //   .string()
  //   .required('Receiver ID is required'),
  truckOffer: yup
    .number()
    .min(1)
    .typeError('Offer must be greater than 1')
    .required('Offer is required'),
  // quantity: yup
  //   .number()
  //   .required('Quantity is required')
});
