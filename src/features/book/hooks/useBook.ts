import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import AuthorServices from 'api/services/authorServices';
import BookServices from 'api/services/bookServices';
import UserServices from 'api/services/userServices';
import { useAppNavigate } from 'hooks';
import Toast from 'react-native-toast-message';
import { useAuthStore } from 'store';
import { showToast } from 'utils/helpers';
import queryClient from 'utils/queryClient';

// export const useGetBookByGroupId = () => {
//   return useMutation({
//     mutationFn: BookServices.getBookByGroupId,
//     // onSuccess: (resp, variables) => {
//     //   if (resp.success) {
//     //     const respData = resp.data;
//     //     return respData;
//     //   }
//     //   showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
//     // },
//     onError: (err: any) => {
//       const error = err.response?.data || err;
//       showToast('error', error.error);
//     },
//   });
// };
export const useGetBookByGroupId = (params: any) => {
  const { token } = useAuthStore();
  return useInfiniteQuery({
    queryKey: ['booksByGroup', params.list_id],
    queryFn: ({ pageParam = 1 }) => BookServices.getBookByGroupId({ ...params, page: pageParam, limit: params.limit }),
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
    enabled: !!params.list_id,
  });
};

// export const useGetBookByAuthorId = () => {
//   return useMutation({
//     mutationFn: AuthorServices.getBookByAuthorId,
//     onError: (err: any) => {
//       const error = err.response?.data || err;
//       showToast('error', error.error);
//     },
//   });
// };
export const useGetBookByAuthorId = (params: any) => {
  const { token } = useAuthStore();
  return useInfiniteQuery({
    queryKey: ['booksByAuthor', params.id],
    queryFn: ({ pageParam = 1 }) => AuthorServices.getBookByAuthorId({
      ...params, page: pageParam, limit: params.limit
    }),
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage.data.pagination.page;
      const totalPages = lastPage.data.pagination.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
    enabled: !!params.id,
  });
};

export const useGetBookBySearchKey = (params: any) => {
  const { token } = useAuthStore();
  return useInfiniteQuery({
    queryKey: ['booksBySearch', params.search],
    queryFn: ({ pageParam = 1 }) => BookServices.getBookBySearchKey({
      ...params, page: pageParam, limit: params.limit
    }),
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
    enabled: !!params.search,
  });
};

export const useGetBookDetail = () => {
  return useMutation({
    mutationFn: BookServices.getBookDetail,
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });
};

export const useGetAllBookRelated = () => {
  return useMutation({
    mutationFn: BookServices.getAllBookRelated,
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });
};

export const useBuyBook = () => {
  const { appNavigation } = useAppNavigate();

  return useMutation({
    mutationFn: BookServices.buyBook,
    onSuccess(resp, variables) {
      if (resp.success) {
        appNavigation.goBack();
      } else {
        showToast('error', resp.error);
      }
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });
};