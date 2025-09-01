import { requestHandler } from "@/utils/requestHandler"



export const fetchOrderAnalyticsRequest = async (query: string) => {
  const url = '/order/get-orders-count' + (query ?? '')
  return await requestHandler('get', url)
}




export const updateOrderStatusRequest = async (data: unknown, id: string) => {
  const url = `/order/status/${id}`;
  return await requestHandler('patch', url, data)
}

export const updateOrderPriceRequest = async (data: unknown, id: string) => {
  const url = `/order/price/${id}`;
  return await requestHandler('patch', url, data)
}


// start here

export const fetchOrdersRequest = async (query: string, pageParam: number) => {
  const url = '/order' + (query ?? '') + pageParam
  // console.log(url, "url in fetchOrdersRequest");
  // console.log(query, "query in fetchOrdersRequest");
  // console.log(pageParam, "pageParam in fetchOrdersRequest");
  return await requestHandler('get', url)
}



export const saveOrdersRequest = async (data: unknown) => {
  const url = '/order';
  return await requestHandler('post', url, data)
}

export const updateOrderRequest = async (data: unknown, id: string) => {
  const url = `/order/update/${id}`;
  return await requestHandler('patch', url, data)
}

export const getOrderDetailsRequest = async (id: string) => {
  const url = `/order/${id}`;
  return await requestHandler('get', url)
}


export const fetchNegotiationsRequest = async (query: string, pageParam: number) => {
  const url = '/negotiation' + (query ?? '') + pageParam
  // console.log(url, "url in fetchNegotiationsRequest");
  // console.log(query, "query in fetchNegotiationsRequest");
  // console.log(pageParam, "pageParam in fetchNegotiationsRequest");
  return await requestHandler('get', url)
}

export const getNegotiationDetailsRequest = async (id: string) => {
  const url = `/negotiation/${id}`;
  return await requestHandler('get', url)
}

export const acceptNegotiationRequest = async (data: unknown, id: string) => {
  const url = `/negotiation/${id}/accept`;
  return await requestHandler('post', url, data)
}