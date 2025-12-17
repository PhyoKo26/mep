import { API_ENDPOINTS } from 'api/endpoints';
import { GetPostRequest } from 'types/api.request';
import apiClient from 'utils/apiClient';

export const PaymentServices = {
  getPayments: async (reqData: GetPostRequest) => {
    const response = await apiClient.post(API_ENDPOINTS.get_all_payments, reqData);
    return response.data;
  },

  getPaymentDesc: async (reqData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.payment_desc, reqData);
    return response.data;
  },

  uploadPayment: async (reqData: any | FormData) => {
    const response = await apiClient.post(API_ENDPOINTS.payment_upload, reqData, {
      headers: reqData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
};
