import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import AuthorServices from 'api/services/authorServices';
import BookServices from 'api/services/bookServices';
import UserServices from 'api/services/userServices';
import { useAppNavigate } from 'hooks';
import Toast from 'react-native-toast-message';
import { useAuthStore } from 'store';
import { BookQueryParams } from 'types/api.request';
import { NormalizedResponse } from 'types/api.response';
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
export const useGetBookByGroupId = (params: BookQueryParams) => {
  const { token } = useAuthStore();

  return useInfiniteQuery<NormalizedResponse>({
    queryKey: ['booksByGroup', params.list_id, token],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await BookServices.getBookByGroupId({
        ...params,
        page: pageParam,
      });

      return {
        data: res.data?.books || res.data || [],
        pagination: {
          page: res.pagination?.page ?? res.data?.pagination?.page ?? 1,
          totalPages:
            res.pagination?.totalPages ??
            res.data?.pagination?.totalPages ??
            1,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: Boolean(params.list_id),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetBookByAuthorId = (params: BookQueryParams) => {
  const { token } = useAuthStore();

  return useInfiniteQuery<NormalizedResponse>({
    queryKey: ['booksByAuthor', params.id, token],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await AuthorServices.getBookByAuthorId({
        ...params,
        page: pageParam,
      });

      return {
        data: res.data?.books || res.data || [],
        pagination: {
          page: res.pagination?.page ?? res.data?.pagination?.page ?? 1,
          totalPages:
            res.pagination?.totalPages ??
            res.data?.pagination?.totalPages ??
            1,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: Boolean(params.id),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetBookBySearchKey = (params: BookQueryParams) => {
  const { token } = useAuthStore();

  return useInfiniteQuery<NormalizedResponse>({
    queryKey: ['booksBySearch', params.search, token],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await BookServices.getBookBySearchKey({
        ...params,
        page: pageParam,
      });

      return {
        data: res.data?.books || res.data || [],
        pagination: {
          page: res.pagination?.page ?? res.data?.pagination?.page ?? 1,
          totalPages:
            res.pagination?.totalPages ??
            res.data?.pagination?.totalPages ??
            1,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: Boolean(params.search),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAllBook = (params: BookQueryParams) => {
  const { token } = useAuthStore();

  return useInfiniteQuery<NormalizedResponse>({
    queryKey: ['book-lists', token],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await BookServices.getAllBooks({
        ...params,
        page: pageParam,
      });

      return {
        data: res.data?.books || res.data || [],
        pagination: {
          page: res.pagination?.page ?? res.data?.pagination?.page ?? 1,
          totalPages:
            res.pagination?.totalPages ??
            res.data?.pagination?.totalPages ??
            1,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !params.search && !params.id && !params.list_id,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
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