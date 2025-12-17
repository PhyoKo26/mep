import { View, Dimensions, StatusBar, Image } from 'react-native';
import React from 'react';
import { FormOtp, FormWrapper } from 'components/form';
import AuthHeader from '../components/AuthHeader';
import { FormProvider, useForm } from 'react-hook-form';
import { LinearButton, ScreenWrapper } from 'components';
import { useAppNavigate, useDeviceInfo, useTranslation } from 'hooks';
import { OtpSchema, OtpSchemaType } from '../validation/otpSchema';
import { zodResolver } from 'utils/zodResolver';
import { useAuthStore } from 'store';
import { useAuth } from '../hooks/useAuth';
import LinearGradient from 'react-native-linear-gradient';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const logoSrc = require('../../../assets/images/logo.png');

const OtpScreen = () => {
  const methods = useForm<OtpSchemaType>({
    resolver: zodResolver(OtpSchema),
  });
  const t = useTranslation();
  const { appNavigation } = useAppNavigate();
  const { fcmToken, setIsAuthenticated, setToken } = useAuthStore();
  const deviceInfo = useDeviceInfo();

  const { useVerifyOtp } = useAuth();

  const { mutate: handleVerifyOTP, isPending } = useVerifyOtp;
  const { transId, loginPhone, loginData } = useAuthStore();

  const onSubmit = methods.handleSubmit((data) => {
    setToken('abab', 'Bareers');
    setIsAuthenticated(true);
  });

  return (
    <LinearGradient
      colors={['#3847BB', '#02107D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center' }}
    >
      {/* <ScreenWrapper> */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {/* <AuthHeader /> */}
      <FormWrapper extraScrollHeight={75} wrapperStyle={{ flex: 1 }}>
        <View className='items-center' style={{ marginTop: HEIGHT / 10 }}>
          <Image source={logoSrc} style={{ width: WIDTH / 1.3 }} resizeMode="contain" />
        </View>

        <View className="flex px-5 gap-10 rounded-2xl">
          <FormProvider {...methods}>
            <FormOtp name="otp" label={'Add OTP'} />
            <LinearButton
              gradientClassName="h-12"
              onPress={onSubmit}
              style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
              isLoading={isPending}
              disabled={isPending}
              variant={'outline'}
              outlineColor={'#FFFFFF'}
            >
              {t.logIn}
            </LinearButton>
          </FormProvider>
        </View>
      </FormWrapper>
      {/* </ScreenWrapper> */}
    </LinearGradient>
  );
};

export default OtpScreen;
