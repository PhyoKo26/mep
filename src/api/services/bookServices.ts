import { API_ENDPOINTS } from 'api/endpoints';
// import { GetMemberRequest } from 'types/api.request';
import { } from 'types/api.response';
import apiClient from 'utils/apiClient';

const BookServices = {
  getBookByGroupId: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_books_by_group_id, reqBody);
    return response.data;
  },
  getBookBySearchKey: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_books_by_search, reqBody);
    return response.data;
  },
  getAllBooks: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_books_by_search, reqBody);
    return response.data;
  },
  getBookDetail: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_book_detail, reqBody);
    return response.data;
  },
  getAllBookRelated: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_all_book_related, reqBody);
    return response.data;
  },
  getMyCollections: async (reqData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_my_collections, reqData);
    return response.data;
  },
  buyBook: async (reqData: any | FormData) => {
    const response = await apiClient.post(API_ENDPOINTS.buy_book, reqData, {
      headers: reqData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
};

export default BookServices;
