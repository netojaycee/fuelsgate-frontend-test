import { publicRequestHandler } from '@/utils/publicRequestHandler';

export const fetchPublicStates = async () => {
  const url = '/state';
  return await publicRequestHandler('get', url);
};

export const fetchPublicStateLGA = async (state) => {
  if (!state) return null;
  const url = `/state/${state}/lga`;
  return await publicRequestHandler('get', url);
};
