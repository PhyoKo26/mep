import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import PostServices from 'api/services/postService';
import UserServices from 'api/services/userServices';
import Toast from 'react-native-toast-message';
import queryClient from 'utils/queryClient';
import { ArticleQueryParams, GetMemberRequest, GetPostRequest } from 'types/api.request';

// export const useGetUser = () => {
//   return useQuery({
//     queryKey: ['user-details'],
//     queryFn: UserServices.getUser,
//   });
// };
export const useGetUser = (reqData: GetMemberRequest) => {
  return useQuery({
    queryKey: ['user-details'],
    queryFn: async () => {
      try {
        return await UserServices.getUser(reqData);
      } catch (err: any) {
        const error = err.response?.data || err;
        Toast.show({
          type: 'error',
          text1: error.error,
        });
        throw err; // important to rethrow so React Query knows error state
      }
    },
    enabled: !!reqData.device_id,
  });
};
// export const useGetUser = () => {
//   return useMutation({
//     mutationFn: UserServices.getUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['user-details'] });
//     },
//     onError: (err: any) => {
//       const error = err.response?.data || err;
//       Toast.show({
//         type: 'error',
//         text1: error.error,
//       });
//     },
//   });
// };

// export const useGetAllArticles = (params: ArticleQueryParams) => {
//   return useQuery({
//     queryKey: ['all-articles', params],
//     queryFn: fetchArticlesWithParams,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });
// };
export const useGetAllArticles = (params: ArticleQueryParams) => {
  return useInfiniteQuery({
    queryKey: ['all-articles', params.device_id, params.search, params.category],
    queryFn: ({ pageParam = 1 }) => PostServices.getAllPosts({ ...params, page: pageParam, limit: params.limit }),
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage.data.pagination.page;
      const totalPages = lastPage.data.pagination.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    initialPageParam: 1,
    enabled: !!params.device_id,
  });
};

export const useGetArticleDetail = () => {
  return useMutation({
    mutationFn: ({ postId, reqData }: { postId: number | string; reqData: GetPostRequest }) =>
      PostServices.getPostById(postId, reqData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-articles'] });
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      Toast.show({
        type: 'error',
        text1: error.error,
      });
    },
  });
};
// export const useGetArticleDetail = () => {
//   return useMutation(
//     ({ postId, reqData }: { postId: string | number; reqData: GetPostRequest }) =>
//       PostServices.getPostById(postId, reqData),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ['all-articles'] });
//       },
//       onError: (err: any) => {
//         const error = err.response?.data || err;
//         Toast.show({
//           type: 'error',
//           text1: error.error,
//         });
//       },
//     }
//   );
// };
