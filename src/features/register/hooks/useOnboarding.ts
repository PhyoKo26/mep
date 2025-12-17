import { useMutation, useQuery } from '@tanstack/react-query';
import UserServices from 'api/services/userServices';
import { useAuth } from 'features/auth/hooks/useAuth';
import { useAppNavigate, useDeviceInfo } from 'hooks';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuthStore, useOnboardingStore } from 'store';
import { } from 'types/api.request';
import { LoginResponse } from 'types/api.response';

export const useCreateUser = () => {
  const { setCompleteStep, updateData, setStep } = useOnboardingStore();
  const { setToken, setIsAuthenticated } = useAuthStore();
  const { appNavigation } = useAppNavigate();

  return useMutation({
    mutationFn: UserServices.createUser,
    onSuccess(data, variables) {
      const formDataToObject = (formData: FormData) => {
        const object: Record<string, any> = {};
        (formData as any)._parts.forEach(([key, value]: [string, any]) => {
          object[key] = value;
        });
        return object;
      };
      const variablesObj = formDataToObject(variables);
      // console.log('useCreateUser', data);

      updateData('step2', {
        id: data.data.id,
        profile: variablesObj.profile,
        firstname: variablesObj.firstname,
        lastname: variablesObj.lastname,
        dob: variablesObj.dob,
        phone: variablesObj.phone,
        father: variablesObj.father,
        township: variablesObj.township,
        division: variablesObj.division,
        password: variablesObj.password,
        confirmpwd: variablesObj.confirmpwd,
        nrcTownship: variablesObj.nrcTownship,
        email: variablesObj.email,
        // age: variablesObj.age,
        gender: variablesObj.gender,
        nrcCode: variablesObj.nrcCode,
        nrcType: variablesObj.nrcType,
        nrcNumber: variablesObj.nrcNumber,
        address: variablesObj.address,
        school: variablesObj.school,
        schoolClass: variablesObj.schoolClass,
        schooladdress: variablesObj.schooladdress,
        degree: variablesObj.degree,
        date: variablesObj.date,
        institution: variablesObj.institution,
        position: variablesObj.position,
        department: variablesObj.department,
        company: variablesObj.company,
        education: variablesObj.education,
        interest: variablesObj.interest,
        other_interests: variablesObj.other_interests,
        reason: variablesObj.reason,
      });

      Alert.alert('🎉 Request Received!', data.message, [
        // { text: 'OK', onPress: () => appNavigation.navigate('AuthStack') },
        { text: 'OK', onPress: () => setStep(5) },
      ]);
      // setIsAuthenticated(true);
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      Toast.show({
        type: 'error',
        text2: error.error || 'Failed to request member. Please try again.',
      });
    },
  });
};

export const useMemberFees = () => {
  const deviceInfo = useDeviceInfo();
  const { useGuestToken, useTokenRequest } = useAuth();
  const { mutate: handleGuestToken, isPending: isGuestLoading } = useGuestToken;
  const { mutate: handleTokenRequest, isPending: isTokenRequestLoading } = useTokenRequest;

  const { data: userData, setCompleteStep, updateData, setStep } = useOnboardingStore();
  const { setToken, setIsAuthenticated } = useAuthStore();
  const { appNavigation } = useAppNavigate();

  return useMutation({
    mutationFn: UserServices.memberFee,
    onSuccess(resp, variables) {
      if (resp.success) {
        const formDataToObject = (formData: FormData) => {
          const object: Record<string, any> = {};
          (formData as any)._parts.forEach(([key, value]: [string, any]) => {
            object[key] = value;
          });
          return object;
        };
        const variablesObj = formDataToObject(variables);
        // console.log('useMemberFees', data);

        updateData('step3', {
          paymentMethod: variablesObj.platform
        });

        const reqBody = {
          device_id: deviceInfo.udid,
          member_id: "",
          member_request_id: userData.step2.id?.toString()
        };
        Alert.alert('🎉 Payment Received!', resp.message, [
          { text: 'OK', onPress: () => handleTokenRequest(reqBody) },
        ]);
        // setIsAuthenticated(true);
      } else {
        Toast.show({
          type: 'error',
          text1: resp.error,
        });
      }
    },
    onError: (err: any) => {
      const error = err.response?.data || err;
      Toast.show({
        type: 'error',
        text2: error.error || 'Failed to request member. Please try again.',
      });
    },
  });
};