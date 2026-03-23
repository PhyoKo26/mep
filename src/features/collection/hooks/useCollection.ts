import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import BookServices from 'api/services/bookServices';
import { useAuthStore } from 'store';
import { NormalizedResponse } from 'types/api.response';
import { showToast } from 'utils/helpers';
import queryClient from 'utils/queryClient';
import { Book } from 'features/book/types';

// export const useGetMyCollections = (params: any) => {
//   const { token } = useAuthStore();
//   return useInfiniteQuery({
//     queryKey: ['my-collections', params], // ✅ Include params
//     queryFn: ({ pageParam = 1 }) => BookServices.getMyCollections({ ...params, page: pageParam, limit: params.limit }),
//     getNextPageParam: (lastPage: any) => {
//       const currentPage = lastPage.pagination.page;
//       const totalPages = lastPage.pagination.totalPages;
//       return currentPage < totalPages ? currentPage + 1 : undefined;
//     },
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: true,        // ✅ Changed
//     staleTime: 2 * 60 * 1000,   // ✅ 2 minutes
//     gcTime: 5 * 60 * 1000,      // ✅ 5 minutes (formerly cacheTime)
//     initialPageParam: 1,
//     enabled: !!token,
//   });
// };

export const useGetMyCollections = (params: any) => {
  const { token } = useAuthStore();

  return useInfiniteQuery({
    queryKey: ['my-collections', token],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await BookServices.getMyCollections({
        ...params,
        page: pageParam,
      });

      return {
        data: res.data || [],
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
    enabled: !!token,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};
