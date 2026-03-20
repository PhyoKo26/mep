import { API_ENDPOINTS } from 'api/endpoints';
// import { GetMemberRequest } from 'types/api.request';
import { } from 'types/api.response';
import apiClient from 'utils/apiClient';

const AuthorServices = {
  getAllAuthors: async (reqData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_all_authors, reqData);
    return response.data;
  },
  getBookByAuthorId: async (reqBody: any) => {
    const response = await apiClient.post(API_ENDPOINTS.get_books_by_author_id, reqBody);
    return response.data;
  },
};

export default AuthorServices;
