import { useQuery } from '@tanstack/react-query';
import { platformConfigService } from '@/services/platform-config.service';
import { useState, useEffect } from 'react';

interface ServiceFees {
    transporterServiceFee: number;
    traderServiceFee: number;
}

export const useServiceFees = () => {
    // Default values as fallbacks if API fails
    const [serviceFees, setServiceFees] = useState<ServiceFees>({
        transporterServiceFee: 0.03, // 3% default 
        traderServiceFee: 0.045, // 4.5% default
    });

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['serviceFees'],
        queryFn: async () => {
            try {
                const response = await platformConfigService.getServiceFees();
                console.log('Fetched service fees:', response);
                return response;
            } catch (err) {
                console.error('Error fetching service fees:', err);

                // Try fetching individual keys as fallback
                try {
                    const [transporterFee, traderFee] = await Promise.all([
                        platformConfigService.getConfigByKey('transporter_service_fee_percentage'),
                        platformConfigService.getConfigByKey('trader_service_fee_percentage')
                    ]);

                    return {
                        transporterServiceFee: parseFloat(transporterFee.value) / 100,
                        traderServiceFee: parseFloat(traderFee.value) / 100
                    };
                } catch (keyError) {
                    console.error('Error fetching individual service fee keys:', keyError);
                    // Return default values if both approaches fail
                    return serviceFees;
                }
            }
        },
        staleTime: 60 * 60 * 1000, // 1 hour cache
    });

    useEffect(() => {
        if (data) {
            setServiceFees({
                transporterServiceFee: data.transporterServiceFee || 0.03,
                traderServiceFee: data.traderServiceFee || 0.045
            });
        }
    }, [data]);

    return {
        serviceFees,
        isLoading,
        error,
        refetch
    };
};
