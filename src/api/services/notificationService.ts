import { API_ENDPOINTS } from 'api/endpoints';
import { INotification } from 'types';
import { GetPostRequest } from 'types/api.request';
import apiClient from 'utils/apiClient';

export const NotificationServices = {
  // getNotifications: async (userId?: string | number) => {
  //   const response = await apiClient.get<INotification[]>(API_ENDPOINTS.get_notifications(userId));
  //   return response.data;
  // },
  getNotifications: async (reqData: GetPostRequest) => {
    const response = await apiClient.post(API_ENDPOINTS.get_all_notifications, reqData);
    return response.data;
  },
};
