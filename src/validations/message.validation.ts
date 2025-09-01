import * as yup from 'yup';

// export const messageSchema = yup.object({
//   offerId: yup
//     .string()
//     .required('Offer ID is required'),
//   offer: yup
//     .number()
//     .min(1)
//     .typeError('Offer must be greater than 1')
//     .required('Offer is required'),
// });

export const messageSchema = yup.object({
  offerId: yup
    .string()
    .required('Offer ID is required'),
  offer: yup
    .number()
    .positive('Offer must be greater than 0')
    .required('Offer is required'),
});

// Optional schema for dynamic forms that can handle both order and truck messages
export const flexibleMessageSchema = yup.object({
  offerId: yup
    .string()
    .optional(),
  offer: yup
    .number()
    .positive('Offer must be greater than 0')
    .optional(),
});

export const truckMessageSchema = yup.object({
  truckOfferId: yup
    .string()
    .required('Truck Offer ID is required'),
  truckOffer: yup
    .number()
    .min(1)
    .typeError('Truck Offer must be greater than 1')
    .required('Truck Offer is required'),
});



