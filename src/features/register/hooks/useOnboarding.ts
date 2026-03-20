import { useMutation, useQuery } from '@tanstack/react-query';
import UserServices from 'api/services/userServices';
import { useAuth } from 'features/auth/hooks/useAuth';
import { useAppNavigate, useDeviceInfo } from 'hooks';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuthStore, useOnboardingStore } from 'store';
import { } from 'types/api.request';
import { LoginResponse } from 'types/api.response';
import { showToast } from 'utils/helpers';

export const useCreateUser = () => {
  const { setCompleteStep, updateData, setStep } = useOnboardingStore();
  const { setUser, setToken, setRefreshToken, setIsAuthenticated } = useAuthStore();
  const { appNavigation } = useAppNavigate();

  return useMutation({
    mutationFn: UserServices.createUser,
    onSuccess: (resp, variables) => {
      if (resp.success) {
        const respData = resp.data;
        setUser(respData.user);
        setToken(respData.access_token, 'Bearer');
        setRefreshToken(respData.refresh_token, 'Bearer');
        setIsAuthenticated(true);
      }
      showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });
};
