import { publicRequestHandler } from "@/utils/publicRequestHandler"

export const fetchPublicTrucksRequest = async (query: string, pageParam: number) => {
    const url = '/truck/public' + (query ?? '') + `?page=${pageParam}`;
    return await publicRequestHandler('get', url)
}
