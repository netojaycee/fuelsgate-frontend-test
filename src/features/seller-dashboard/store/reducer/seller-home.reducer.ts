import { UPDATE_ORDER_LIMIT, UPDATE_ORDER_PAGE, UPDATE_PRODUCT_LIMIT, UPDATE_PRODUCT_PAGE } from "../actions/seller-home.action";

const initialState: PaginationState = {
  productPage: 1,
  productLimit: 15,
  orderPage: 1,
  orderLimit: 10,
};

const reducer = (
  state: PaginationState,
  action: PaginationAction,
): PaginationState => {
  switch (action.type) {
    case UPDATE_PRODUCT_PAGE:
      return { ...state, productPage: action.payload };
    case UPDATE_PRODUCT_LIMIT:
      return { ...state, productLimit: action.payload };
    case UPDATE_ORDER_PAGE:
      return { ...state, orderPage: action.payload };
    case UPDATE_ORDER_LIMIT:
      return { ...state, orderLimit: action.payload };
    default:
      return state;
  }
};

export { initialState, reducer }