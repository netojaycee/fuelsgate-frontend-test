
import { requestHandler } from '@/utils/requestHandler';

export interface PlatformConfigDto {
    key: string;
    value: string;
    description?: string;
}

export class PlatformConfigService {
    private static instance: PlatformConfigService;
    private readonly API_URL = '/platform-config';

    private constructor() { }

    public static getInstance(): PlatformConfigService {
        if (!PlatformConfigService.instance) {
            PlatformConfigService.instance = new PlatformConfigService();
        }
        return PlatformConfigService.instance;
    }

    /**
     * Fetch a platform configuration by key
     * @param key The configuration key
     * @returns The configuration value
     */
    async getConfigByKey(key: string): Promise<PlatformConfigDto> {
        try {
            const url = `${this.API_URL}/${key}`;
            const response = await requestHandler('get', url);
            return response.data;
        } catch (error) {
            console.error(`Error fetching platform config for key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Fetch service fees for transporter and buyer/trader
     * @returns The service fee percentages
     */
    async getServiceFees(): Promise<{
        transporterServiceFee: number;
        traderServiceFee: number;
    }> {
        try {
            const url = `${this.API_URL}/service/fees`;
            const response = await requestHandler('get', url);
            return response.data;
        } catch (error) {
            console.error('Error fetching service fees:', error);
            throw error;
        }
    }

    /**
     * Update service fees for transporter and buyer/trader
     * @param transporterServiceFee The transporter service fee percentage
     * @param traderServiceFee The trader service fee percentage
     * @returns The updated service fee percentages
     */
    async updateServiceFees(
        transporterServiceFee: number,
        traderServiceFee: number
    ): Promise<{
        transporterServiceFee: number;
        traderServiceFee: number;
    }> {
        try {
            const url = `${this.API_URL}/service/fees`;
            const data = {
                transporterServiceFee,
                traderServiceFee
            };
            const response = await requestHandler('put', url, data);
            return response.data;
        } catch (error) {
            console.error('Error updating service fees:', error);
            throw error;
        }
    }
}

export const platformConfigService = PlatformConfigService.getInstance();
