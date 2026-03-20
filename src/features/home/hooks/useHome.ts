import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import AuthorServices from 'api/services/authorServices';
import HomeServices from 'api/services/homeServices';
import { useAuthStore } from 'store';
import { showToast } from 'utils/helpers';
import queryClient from 'utils/queryClient';

// export const useGetHome = () => {
//   return useQuery({
//     queryKey: ['home-datas'],
//     queryFn: UserServices.getUser,
//   });
// };

export const useGetHome = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ['home-datas'],
    queryFn: async () => {
      try {
        let resp = await HomeServices.getHome();
        if (resp.success) {
          const respData = resp.data;
          return respData;
        }
        showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
      } catch (err: any) {
        const error = err.response?.data || err;
        showToast('error', error.error);
        throw err; // important to rethrow so React Query knows error state
      }
    },
    enabled: !!token,
  });
};

export const useGetHomePromotions = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ['home-promotions'],
    queryFn: async () => {
      try {
        let resp = await HomeServices.getHomePromotions();
        if (resp.success) {
          const respData = resp.data;
          return respData;
        }
        showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
      } catch (err: any) {
        const error = err.response?.data || err;
        showToast('error', error.error);
        throw err; // important to rethrow so React Query knows error state
      }
    },
    enabled: !!token,
  });
};

export const useGetHomeAuthors = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ['home-authors'],
    queryFn: async () => {
      try {
        let resp = await AuthorServices.getAllAuthors({});
        if (resp.success) {
          const respData = resp.data;
          return respData;
        }
        showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
      } catch (err: any) {
        const error = err.response?.data || err;
        showToast('error', error.error);
        throw err; // important to rethrow so React Query knows error state
      }
    },
    enabled: !!token,
  });
};

export const useGetAllBookGroups = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ['home-book-groups'],
    queryFn: async () => {
      try {
        let resp = await HomeServices.getAllBookGroups();
        if (resp.success) {
          const respData = resp.data;
          return respData;
        }
        showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
      } catch (err: any) {
        const error = err.response?.data || err;
        showToast('error', error.error);
        throw err; // important to rethrow so React Query knows error state
      }
    },
    enabled: !!token,
  });
};