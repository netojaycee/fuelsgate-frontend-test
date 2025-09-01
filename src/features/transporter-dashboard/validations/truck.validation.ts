import * as yup from 'yup';

export const truckSchema = yup.object({
  truckNumber: yup
    .string()
    .required('Truck number is required'),
  capacity: yup
    .string()
    .required('Truck capacity is required'),
  productId: yup
    .string()
    .required('Product is required'),
  depotHubId: yup
    .string()
    .required('Depot Hub is required'),
  depot: yup
    .string()
    .required('Depot is required'),
  // currentState: yup
  //   .string()
  //   .required('Select truck current state location is required'),
  // currentCity: yup
  //   .string()
  //   .required('Select truck current city location is required'),
});

export const truckFormSchema = yup.object({
  truckType: yup
    .string()
    .required('Truck type is required'),
  truckNumber: yup
    .string()
    .when('truckType', {
      is: 'tanker',
      then: (schema) => schema.required('Truck number is required'),
      otherwise: (schema) => schema.optional(),
    }),
  capacity: yup
    .string()
    .when('truckType', {
      is: 'tanker',
      then: (schema) => schema.required('Truck capacity is required'),
      otherwise: (schema) => schema.optional(),
    }),
  productId: yup
    .string()
    .when('truckType', {
      is: 'tanker',
      then: (schema) => schema.required('Product is required'),
      otherwise: (schema) => schema.optional(),
    }),
  depotHubId: yup
    .string()
    .when('truckType', {
      is: 'tanker',
      then: (schema) => schema.required('Depot Hub is required'),
      otherwise: (schema) => schema.optional(),
    }),
  depot: yup
    .string()
    .when('truckType', {
      is: 'tanker',
      then: (schema) => schema.required('Depot is required'),
      otherwise: (schema) => schema.optional(),
    }),
  deliveryType: yup
    .string()
    .when('truckType', {
      is: 'tanker',
      then: (schema) => schema.required('Delivery type is required'),
      otherwise: (schema) => schema.optional(),
    }),
  loadStatus: yup
    .string()
    .when('truckType', {
      is: 'tanker',
      then: (schema) => schema.required('Load status is required'),
      otherwise: (schema) => schema.optional(),
    }),
  currentState: yup
    .string()
    .when('truckType', {
      is: 'flatbed',
      then: (schema) => schema.required('Current state is required'),
      otherwise: (schema) => schema.optional(),
    }),
  currentCity: yup
    .string()
    .when('truckType', {
      is: 'flatbed',
      then: (schema) => schema.required('Current city is required'),
      otherwise: (schema) => schema.optional(),
    }),
});
