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
    setIsAuthenticated,
    setAuthData,
    logout,
    setGuestToken,
    guestToken,
  } = useAuthStore();

  const { setStep, resetOnboarding } = useOnboardingStore();
  const { appNavigation } = useAppNavigate();

  /** 🔹 Define each mutation as its own hook-like property **/

  const useRegisterToken = useMutation({
    mutationFn: AuthServices.registerToken,
    onSuccess: (resp) => {
      showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });

  const useRequestOTP = useMutation({
    mutationFn: AuthServices.requestOTP,
    onSuccess: (resp, variables) => {
      if (resp.success) {
        setLoginPhone(variables.phone_number);
        setLoginData(resp.data);
        if (variables.type === 'login') {
          appNavigation.navigate('OtpScreen');
        } else {
          setStep(3);
        }
      }
      showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });

  const useVerifyOtp = useMutation({
    mutationFn: AuthServices.verifyOtp,
    onSuccess: (resp, variables) => {
      if (resp.success) {
        if (variables.type === 'login') {
          setToken(resp.data.token, 'Bareers');
          setAuthData(resp.data);
          setIsAuthenticated(true);
        } else {
          setStep(4);
        }
      }
      showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });

  const useLogout = useMutation({
    mutationFn: AuthServices.logout,
    onSuccess: (resp) => {
      if (resp.success) {
        logout();
        resetOnboarding();
        setTimeout(() => {
          NavigationService.reset('AuthStack');
        }, 500);
      }
      showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });

  const useGuestToken = useMutation({
    mutationFn: AuthServices.guestToken,
    onSuccess: (resp) => {
      if (resp.success) {
        setGuestToken(resp.token, 'Bareers');
      }
      showToast(resp.success ? 'success' : 'error', resp.message || resp.error);
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });

  const useTokenRequest = useMutation({
    mutationFn: AuthServices.tokenRequest,
    onSuccess: (resp) => {
      if (resp.success) {
        setToken(resp.token, 'Bareers');
        setAuthData(resp);
        setIsAuthenticated(true);
      } else {
        setToken(guestToken || '', 'Bareers');
        setIsAuthenticated(true);
      }
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      showToast('error', error.error);
    },
  });

  return {
    useRegisterToken,
    useRequestOTP,
    useVerifyOtp,
    useLogout,
    useGuestToken,
    useTokenRequest,
  };
};
