import { requestHandler } from '@/utils/requestHandler';

// Get badge counts for a user
export const fetchBadgeCountsRequest = async (userId: string) => {
    const url = `/notification/user/${userId}/badge-counts`;
    return await requestHandler('get', url);
};

// Get notifications for a user
export const fetchUserNotificationsRequest = async (userId: string, limit = 20) => {
    const url = `/notification/user/${userId}?limit=${limit}`;
    return await requestHandler('get', url);
};

// Mark notification as read
export const markNotificationAsReadRequest = async (notificationId: string) => {
    const url = `/notification/mark-read/${notificationId}`;
    return await requestHandler('post', url);
};

// Mark all notifications as read
export const markAllNotificationsAsReadRequest = async (userId: string) => {
    const url = `/notification/mark-all-read/${userId}`;
    return await requestHandler('post', url);
};

// Mark category as read
export const markCategoryAsReadRequest = async (userId: string, category: string) => {
    const url = `/notification/mark-category-read/${userId}/${category}`;
    return await requestHandler('post', url);
};
