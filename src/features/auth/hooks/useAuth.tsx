import { useMutation } from '@tanstack/react-query';
import { useAppNavigate } from 'hooks';
import { useAuthStore, useOnboardingStore } from 'store';
import AuthServices from 'api/services/authService';
import { NavigationService } from 'navigation/NavigationService';
import { showToast } from 'utils/helpers';

export const useAuth = () => {
  const {
    setLoginPhone,
    setLoginData,
    setToken,
    setRefreshToken,
    setUser,
    setIsAuthenticated,
    setAuthData,
    logout,
    setGuestToken,
    guestToken,
  } = useAuthStore();

  const { setStep, resetOnboarding } = useOnboardingStore();
  const { appNavigation } = useAppNavigate();

  /** 🔹 Define each mutation as its own hook-like property **/

  const useLogin = useMutation({
    mutationFn: AuthServices.login,
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

  return {
    useLogin,
  };
};
