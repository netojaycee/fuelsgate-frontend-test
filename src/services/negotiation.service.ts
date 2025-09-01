import { requestHandler } from '@/utils/requestHandler';

// Fetch ongoing negotiations for a user
export const fetchOngoingNegotiationsRequest = async (userId: string) => {
    const url = `/negotiations/ongoing/${userId}`;
    return await requestHandler('get', url);
};

// Add more negotiation-related API functions as needed
