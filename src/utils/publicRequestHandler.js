import publicHttp from '@/lib/publicHttp';

/**
 * Request handler for public API routes that don't require authentication.
 * Use this for public facing pages and components.
 */
export const publicRequestHandler = async (method, url, formData) => {
  try {
    const response = await publicHttp[method.toLowerCase()](url, formData);
    return response?.data;
  } catch (error) {
    throw error?.response?.data;
  }
};
