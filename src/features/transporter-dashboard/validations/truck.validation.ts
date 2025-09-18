import * as yup from 'yup';

export const truckSchema = yup.object({
  truckNumber: yup.string().required('Truck number is required'),
  capacity: yup.string().required('Truck capacity is required'),
  productId: yup.string().required('Product is required'),
  depotHubId: yup.string().required('Depot Hub is required'),
  depot: yup.string().required('Depot is required'),
  // currentState: yup
  //   .string()
  //   .required('Select truck current state location is required'),
  // currentCity: yup
  //   .string()
  //   .required('Select truck current city location is required'),
});

export const truckFormSchema = yup.object({
  truckType: yup.string().required('Truck type is required'),
  truckFuelType: yup.string().required('Truck fuel type is required'),
  truckCategory: yup.string().required('Truck category is required'),
  truckNumber: yup.string().required('Truck Number is required'),

  capacity: yup.string().required('Truck capacity is required'),

  productId: yup.string().when('truckType', {
    is: 'tanker',
    then: (schema) => schema.required('Product is required'),
    otherwise: (schema) => schema.optional(),
  }),
  depotHubId: yup.string().required('Depot Hub is required'),

  depot: yup.string().required('Depot is required'),
  deliveryType: yup.string().required('Delivery type is required'),
  loadStatus: yup.string().when('truckType', {
    is: 'tanker',
    then: (schema) => schema.required('Load status is required'),
    otherwise: (schema) => schema.optional(),
  }),
});
