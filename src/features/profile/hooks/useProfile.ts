import { useMutation, useQuery } from '@tanstack/react-query';
import UserServices from 'api/services/userServices';
import { useAppNavigate } from 'hooks';
import Toast from 'react-native-toast-message';
import { useAuthStore } from 'store';
import { showToast } from 'utils/helpers';
import queryClient from 'utils/queryClient';

export const useGetUser = () => {
  const { token, setUser } = useAuthStore();
  return useQuery({
    queryKey: ['user-details'],
    queryFn: async () => {
      try {
        let resp = await UserServices.getUser();
        if (resp.success) {
          const respData = resp.data;
          setUser(respData);
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

// export const useGetUser = () => {
//   return useQuery({
//     queryKey: ['user-details'],
//     queryFn: UserServices.getUser,
//   });
// };