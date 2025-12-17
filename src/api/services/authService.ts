import { API_ENDPOINTS } from 'api/endpoints';
import { } from 'types/api.request';
import { GenerateOtpResponse } from 'types/api.response';
import apiClient from 'utils/apiClient';

const AuthServices = {
  registerToken: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.register_token, reqBody);
    return response.data;
  },
  requestOTP: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.request_otp, reqBody);
    return response.data;
  },
  verifyOtp: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.verify_otp, reqBody);
    return response.data;
  },
  logout: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.logout, reqBody);
    return response.data;
  },
  guestToken: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.guest_token, reqBody);
    return response.data;
  },
  tokenRequest: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.token_request, reqBody);
    return response.data;
  },
};

export default AuthServices;
