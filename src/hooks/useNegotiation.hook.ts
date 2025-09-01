import { useQuery } from '@tanstack/react-query';
import { fetchOngoingNegotiationsRequest } from '@/services/negotiation.service';

interface Negotiation {
    _id: string;
    // Add other negotiation properties as needed
}

const useNegotiationHook = () => {
    // Get ongoing negotiations
    const useGetOngoingNegotiations = (userId: string) => {
        return useQuery<Negotiation[]>({
            queryKey: ['ONGOING_NEGOTIATIONS', userId],
            queryFn: async () => {
                const response = await fetchOngoingNegotiationsRequest(userId);
                return response.data;
            },
            enabled: !!userId,
        });
    };

    // Add more negotiation hooks as needed

    return {
        useGetOngoingNegotiations,
    };
};

export default useNegotiationHook;