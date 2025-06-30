import * as yup from 'yup';

export const truckOrderSchema = yup.object({
  truckId: yup.string().required('Truck ID is required'),
  destination: yup.string().required('Destination address is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  loadingDepot: yup.string().required('Loading Depot is required'),
  // loadingCity: yup.string().required('Loading City is required'),
  // loadingAddress: yup.string().required('Loading Address is required'),
  loadingDate: yup.date().typeError('Please enter a loading date'),
});

export const updateTruckOrderPriceSchema = yup.object({
  price: yup
    .number()
    .min(1, { message: 'Please enter a valid number' })
    .typeError('Enter price for this quote')
    .required('Order price is required'),
  arrivalTime: yup
    .date()
    .typeError(
      'Enter estimated time for this truck to arrive at loading depot',
    ),
});
