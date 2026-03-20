import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import BookServices from 'api/services/bookServices';
import Toast from 'react-native-toast-message';
import { useAuthStore } from 'store';
import { showToast } from 'utils/helpers';
import queryClient from 'utils/queryClient';

export const useGetMyCollections = (params: any) => {
  const { token } = useAuthStore();
  return useInfiniteQuery({
    queryKey: ['my-collections'],
    queryFn: ({ pageParam = 1 }) => BookServices.getMyCollections({ ...params, page: pageParam, limit: params.limit }),
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    initialPageParam: 1,
    enabled: !!token,
  });
};
