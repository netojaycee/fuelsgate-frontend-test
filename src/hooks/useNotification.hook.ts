// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//     fetchBadgeCountsRequest,
//     fetchUserNotificationsRequest,
//     markNotificationAsReadRequest,
//     markAllNotificationsAsReadRequest,
//     markCategoryAsReadRequest,
// } from '@/services/notification.service';

// interface BadgeCounts {
//     product_order: number;
//     truck_order: number;
//     chat: number;
// }

// interface Notification {
//     _id: string;
//     userId: string;
//     type: string;
//     message?: string;
//     relatedId?: string;
//     read: boolean;
//     meta?: any;
//     createdAt: string;
//     updatedAt: string;
// }

// const useNotificationHook = () => {
//     const queryClient = useQueryClient();

//     // Get badge counts
//     const useGetBadgeCounts = (userId: string) => {
//         return useQuery<BadgeCounts>({
//             queryKey: ['BADGE_COUNTS', userId],
//             queryFn: async () => {
//                 const response = await fetchBadgeCountsRequest(userId);
//                 console.log('Fetched badge counts:', response);
//                 return response.data;
//             },
//             enabled: !!userId,
//             staleTime: 30000, // 30 seconds
//         });
//     };

//     // Get user notifications
//     const useGetUserNotifications = (userId: string, limit = 20) => {
//         return useQuery<Notification[]>({
//             queryKey: ['USER_NOTIFICATIONS', userId, limit],
//             queryFn: async () => {
//                 const response = await fetchUserNotificationsRequest(userId, limit);
//                 return response.data;
//             },
//             enabled: !!userId,
//         });
//     };

//     // Mark notification as read
//     const useMarkAsRead = () => {
//         return useMutation({
//             mutationFn: async (notificationId: string) => {
//                 const response = await markNotificationAsReadRequest(notificationId);
//                 return response.data;
//             },
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['USER_NOTIFICATIONS'] });
//                 queryClient.invalidateQueries({ queryKey: ['BADGE_COUNTS'] });
//             },
//         });
//     };

//     // Mark all notifications as read
//     const useMarkAllAsRead = () => {
//         return useMutation({
//             mutationFn: async (userId: string) => {
//                 const response = await markAllNotificationsAsReadRequest(userId);
//                 return response.data;
//             },
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['USER_NOTIFICATIONS'] });
//                 queryClient.invalidateQueries({ queryKey: ['BADGE_COUNTS'] });
//             },
//         });
//     };

//     // Mark category as read
//     const useMarkCategoryAsRead = () => {
//         return useMutation({
//             mutationFn: async ({ userId, category }: { userId: string; category: string }) => {
//                 const response = await markCategoryAsReadRequest(userId, category);
//                 return response.data;
//             },
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['BADGE_COUNTS'] });
//                 queryClient.invalidateQueries({ queryKey: ['USER_NOTIFICATIONS'] });
//             },
//         });
//     };

//     // Update badge counts in cache (for real-time updates)
//     const updateBadgeCount = (userId: string, category: keyof BadgeCounts, count: number) => {
//         queryClient.setQueryData(['BADGE_COUNTS', userId], (oldData: BadgeCounts | undefined) => {
//             if (!oldData) return oldData;
//             return {
//                 ...oldData,
//                 [category]: count,
//             };
//         });
//     };

//     return {
//         useGetBadgeCounts,
//         useGetUserNotifications,
//         useMarkAsRead,
//         useMarkAllAsRead,
//         useMarkCategoryAsRead,
//         updateBadgeCount,
//     };
// };

// export default useNotificationHook;


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
    fetchBadgeCountsRequest,
    fetchUserNotificationsRequest,
    markNotificationAsReadRequest,
    markAllNotificationsAsReadRequest,
    markCategoryAsReadRequest,
} from '@/services/notification.service';

interface BadgeCounts {
    product_order: number;
    truck_order: number;
    chat: number;
}

interface Notification {
    _id: string;
    userId: string;
    type: string;
    message?: string;
    relatedId?: string;
    read: boolean;
    meta?: any;
    createdAt: string;
    updatedAt: string;
}

const DEFAULT_BADGE_COUNTS: BadgeCounts = {
    product_order: 0,
    truck_order: 0,
    chat: 0,
};

const useNotificationHook = () => {
    const queryClient = useQueryClient();

    // Get badge counts with proper error handling and default values
    const useGetBadgeCounts = (userId: string) => {
        return useQuery<BadgeCounts>({
            queryKey: ['BADGE_COUNTS', userId],
            queryFn: async () => {
                try {

                    const response = await fetchBadgeCountsRequest(userId);
                    return response;
                } catch (error) {
                    console.error('Error fetching badge counts:', error);
                    // Return default values instead of throwing
                    return DEFAULT_BADGE_COUNTS;
                }
            },
            enabled: !!userId,
            staleTime: 30000, // 30 seconds
            refetchOnWindowFocus: false,
            retry: 3,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Provide initial data to prevent undefined cache
            // initialData: DEFAULT_BADGE_COUNTS,
        });
    };

    // Get user notifications
    const useGetUserNotifications = (userId: string, limit = 20) => {
        return useQuery<Notification[]>({
            queryKey: ['USER_NOTIFICATIONS', userId, limit],
            queryFn: async () => {
                try {
                    const response = await fetchUserNotificationsRequest(userId, limit);
                    return response.data || [];
                } catch (error) {
                    console.error('Error fetching user notifications:', error);
                    return [];
                }
            },
            enabled: !!userId,
            retry: 2,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
        });
    };

    // Mark notification as read
    const useMarkAsRead = () => {
        return useMutation({
            mutationFn: async (notificationId: string) => {
                const response = await markNotificationAsReadRequest(notificationId);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['USER_NOTIFICATIONS'] });
                queryClient.invalidateQueries({ queryKey: ['BADGE_COUNTS'] });
            },
            onError: (error) => {
                console.error('Error marking notification as read:', error);
            },
        });
    };

    // Mark all notifications as read
    const useMarkAllAsRead = () => {
        return useMutation({
            mutationFn: async (userId: string) => {
                const response = await markAllNotificationsAsReadRequest(userId);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['USER_NOTIFICATIONS'] });
                queryClient.invalidateQueries({ queryKey: ['BADGE_COUNTS'] });
            },
            onError: (error) => {
                console.error('Error marking all notifications as read:', error);
            },
        });
    };

    // Mark category as read
    const useMarkCategoryAsRead = () => {
        return useMutation({
            mutationFn: async ({ userId, category }: { userId: string; category: string }) => {
                const response = await markCategoryAsReadRequest(userId, category);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['BADGE_COUNTS'] });
                queryClient.invalidateQueries({ queryKey: ['USER_NOTIFICATIONS'] });
            },
            onError: (error) => {
                console.error('Error marking category as read:', error);
            },
        });
    };

    // Enhanced updateBadgeCount with proper error handling and cache initialization
    const updateBadgeCount = useCallback((userId: string, category: keyof BadgeCounts, count: number) => {
        if (!userId) {
            console.warn('updateBadgeCount: userId is required');
            return;
        }

        try {
            queryClient.setQueryData(['BADGE_COUNTS', userId], (oldData: BadgeCounts | undefined) => {
                // Always return a valid BadgeCounts object, never undefined
                const currentData = oldData || DEFAULT_BADGE_COUNTS;

                const updatedData = {
                    ...currentData,
                    [category]: Math.max(0, count), // Ensure count is never negative
                };

                console.log(`Updated badge count for ${category}:`, {
                    previous: currentData[category],
                    new: updatedData[category],
                    userId,
                });

                return updatedData;
            });
        } catch (error) {
            console.error('Error updating badge count:', error);
        }
    }, [queryClient]);

    // Initialize badge cache for new users
    const initializeBadgeCache = useCallback((userId: string) => {
        if (!userId) return;

        const existingData = queryClient.getQueryData(['BADGE_COUNTS', userId]);
        if (!existingData) {
            console.log('Initializing badge cache for user:', userId);
            queryClient.setQueryData(['BADGE_COUNTS', userId], DEFAULT_BADGE_COUNTS);
        }
    }, [queryClient]);

    // Get current badge counts from cache (useful for immediate access)
    const getBadgeCountsFromCache = useCallback((userId: string): BadgeCounts => {
        if (!userId) return DEFAULT_BADGE_COUNTS;

        const cachedData = queryClient.getQueryData(['BADGE_COUNTS', userId]) as BadgeCounts;
        return cachedData || DEFAULT_BADGE_COUNTS;
    }, [queryClient]);

    // Increment a specific badge count (useful for real-time updates)
    const incrementBadgeCount = useCallback((userId: string, category: keyof BadgeCounts, increment = 1) => {
        if (!userId) return;

        const currentCounts = getBadgeCountsFromCache(userId);
        const newCount = currentCounts[category] + increment;
        updateBadgeCount(userId, category, newCount);
    }, [getBadgeCountsFromCache, updateBadgeCount]);

    // Decrement a specific badge count (useful for real-time updates)
    const decrementBadgeCount = useCallback((userId: string, category: keyof BadgeCounts, decrement = 1) => {
        if (!userId) return;

        const currentCounts = getBadgeCountsFromCache(userId);
        const newCount = Math.max(0, currentCounts[category] - decrement);
        updateBadgeCount(userId, category, newCount);
    }, [getBadgeCountsFromCache, updateBadgeCount]);

    // Reset a specific badge count to zero
    const resetBadgeCount = useCallback((userId: string, category: keyof BadgeCounts) => {
        updateBadgeCount(userId, category, 0);
    }, [updateBadgeCount]);

    // Reset all badge counts to zero
    const resetAllBadgeCounts = useCallback((userId: string) => {
        if (!userId) return;

        queryClient.setQueryData(['BADGE_COUNTS', userId], DEFAULT_BADGE_COUNTS);
        console.log('Reset all badge counts for user:', userId);
    }, [queryClient]);

    return {
        useGetBadgeCounts,
        useGetUserNotifications,
        useMarkAsRead,
        useMarkAllAsRead,
        useMarkCategoryAsRead,
        updateBadgeCount,
        initializeBadgeCache,
        getBadgeCountsFromCache,
        incrementBadgeCount,
        decrementBadgeCount,
        resetBadgeCount,
        resetAllBadgeCounts,
    };
};

export default useNotificationHook;