import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import AuthorServices from 'api/services/authorServices';
import Toast from 'react-native-toast-message';
import { useAuthStore } from 'store';
import { showToast } from 'utils/helpers';
import queryClient from 'utils/queryClient';

export const useGetAllAuthors = (params: any) => {
  const { token } = useAuthStore();
  return useInfiniteQuery({
    queryKey: ['all-authors'],
    queryFn: ({ pageParam = 1 }) => AuthorServices.getAllAuthors({ ...params, page: pageParam, limit: params.limit }),
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
