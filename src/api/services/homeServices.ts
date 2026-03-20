import { API_ENDPOINTS } from 'api/endpoints';
// import { GetMemberRequest } from 'types/api.request';
import { } from 'types/api.response';
import apiClient from 'utils/apiClient';

const HomeServices = {
  getHome: async () => {    
    const response = await apiClient.post(API_ENDPOINTS.get_home);
    return response.data;
  },
  getHomePromotions: async () => {    
    const response = await apiClient.post(API_ENDPOINTS.get_home_promotions);
    return response.data;
  },
  getAllBookGroups: async () => {    
    const response = await apiClient.post(API_ENDPOINTS.get_all_book_groups);
    return response.data;
  },
};

export default HomeServices;
