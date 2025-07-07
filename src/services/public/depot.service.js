import { publicRequestHandler } from '@/utils/publicRequestHandler';

export const fetchPublicDepots = async (query = '') => {
  const url = '/depot-hub' + query;
  return await publicRequestHandler('get', url);
};
