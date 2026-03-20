import { API_ENDPOINTS } from 'api/endpoints';
// import { GetMemberRequest } from 'types/api.request';
import { } from 'types/api.response';
import apiClient from 'utils/apiClient';

const UserServices = {
  getUser: async () => {    
    const response = await apiClient.post(API_ENDPOINTS.get_user);
    return response.data;
  },
  // getMemberById: async (userId: string | number, reqData: GetMemberRequest) => {
  //   const response = await apiClient.post(`${API_ENDPOINTS.get_member_by_id}/${userId}`, reqData);
  //   return response.data;
  // },

  createUser: async (reqData: any | FormData) => {
    const response = await apiClient.post(API_ENDPOINTS.create_user, reqData);
    return response.data;
  },

  // createUser: async (reqData: CreateUserRequest) => {
  //   const response = await apiClient.post(API_ENDPOINTS.create_user, reqData);
  //   return response.data;
  // },
};

export default UserServices;
