import { publicRequestHandler } from '@/utils/publicRequestHandler';

export const fetchPublicProducts = async (query = '') => {
  const url = '/product' + query;
  return await publicRequestHandler('get', url);
};
