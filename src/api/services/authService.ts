import { API_ENDPOINTS } from 'api/endpoints';
import { } from 'types/api.request';
import { GenerateOtpResponse } from 'types/api.response';
import apiClient from 'utils/apiClient';

const AuthServices = {
  login: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.login, reqBody);
    return response.data;
  },
};

export default AuthServices;
