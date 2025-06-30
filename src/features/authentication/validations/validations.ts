import * as yup from "yup"

export const loginSchema = yup.object({
  email: yup.string().email().required('Please enter your email'),
  password: yup.string().required('Please enter your password')
}).required()

export const registerSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  role: yup
    .string()
    .oneOf(
      ['transporter', 'seller', 'buyer'],
      'Role must be either transporter, seller, or buyer',
    )
    .required('Role is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
}).required()

export const forgotPasswordSchema = yup.object({
  email: yup.string().email().required('Please enter your email'),
}).required()

export const verifyOtpSchema = yup.object({
  email: yup.string().email().required('Please enter your email'),
  otp: yup.string().required('Please enter otp that was sent to your mail'),
}).required()

export const resetPasswordSchema = yup.object({
  email: yup.string().email().required('Please enter your email'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
}).required()

export const sellerSchema = yup.object({
  category: yup
    .string()
    .oneOf(
      ['trader', 'depot-owner'],
      'Category must be either traders or depot owner',
    )
    .required('Category is required'),
  depotName: yup.string().when('category', ([category], schema) => {
    return category === 'depot-owner' ?
      schema.required('Please enter your depot name') :
      schema.notRequired()
  }),
  businessName: yup.string().required('Business name is required'),
  products: yup
    .array()
    .of(yup.string().required('Product is required'))
    .required('Please select your products')
    .min(1, 'At least one product is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  officeAddress: yup.string(),
  depotAddress: yup.string().when('category', ([category], schema) => {
    return category === 'depot-owner' ?
      schema.required('Please enter your depot address') :
      schema.notRequired()
  }),
  depotHub: yup.string().required('Please select a Depot Hub'),
});

export const transporterSchema = yup.object({
  companyName: yup
    .string()
    .required('Company name is required.')
    .min(2, 'Company name must be at least 2 characters long.')
    .max(100, 'Company name must be at most 100 characters long.'),
  companyAddress: yup.string().required('Company address is required.'),
  companyEmail: yup.string().email('Invalid email address.'),
  phoneNumber: yup
    .string()
    .required('Phone number is required.')
    .matches(
      /^[8972][0-9]{9}$/,
      'Phone number must be a valid nigerian phone number.',
    ),
  state: yup.string().required('State is required.'),
});

export const buyerSchema = yup.object({
  category: yup
    .string()
    .oneOf(
      ['reseller', 'basic-customer'],
      'Category must be either reseller or basic customer',
    )
    .required('Category is required'),
});
