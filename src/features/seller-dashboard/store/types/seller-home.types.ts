interface PaginationState {
  productPage: number;
  productLimit: number;
  orderPage: number;
  orderLimit: number;
}

type PaginationAction =
  | { type: 'UPDATE_PRODUCT_PAGE'; payload: number }
  | { type: 'UPDATE_PRODUCT_LIMIT'; payload: number }
  | { type: 'UPDATE_ORDER_PAGE'; payload: number }
  | { type: 'UPDATE_ORDER_LIMIT'; payload: number };
