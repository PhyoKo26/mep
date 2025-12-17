import { API_ENDPOINTS } from 'api/endpoints';
import { IPost } from 'types';
import { GetPostRequest } from 'types/api.request';
import apiClient from 'utils/apiClient';

const PostServices = {
  getAllPosts: async (reqData: GetPostRequest) => {
    const response = await apiClient.post(API_ENDPOINTS.get_all_articles, reqData);
    return response.data;
  },
  getPostById: async (postId: string | number, reqData: GetPostRequest) => {
    const response = await apiClient.post(`${API_ENDPOINTS.get_all_articles}/${postId}`, reqData);
    return response.data;
  },
  // getPostById: async (postId: string) => {
  //   const response = await apiClient.get<IPost>(`${API_ENDPOINTS.get_all_articles}/${postId}`);
  //   return response.data;
  // },
};

export default PostServices;
