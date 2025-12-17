import React, { useEffect } from 'react';
import { Dimensions, Platform, StatusBar, TouchableOpacity, View, ImageBackground, Image } from 'react-native';
import { AppText, LinearButton, ScreenWrapper } from 'components';
import { FormInputLogin, FormWrapper } from 'components/form';
import { FormProvider, useForm } from 'react-hook-form';
import { LoginSchema, LoginSchemaType } from '../validation/loginSchema';
import { zodResolver } from 'utils/zodResolver';
import { useAppNavigate, useDeviceInfo, useTranslation } from 'hooks';
import AuthHeader from '../components/AuthHeader';
import { MyanmarIcon } from 'assets/svg';
import { useAuthStore, useLanguageStore, useOnboardingStore } from 'store';
import { cn, formatMyanmarPhoneNumber } from 'utils/helpers';
import HapticFeedback from 'react-native-haptic-feedback';
import { useAuth } from '../hooks/useAuth';
import LinearGradient from 'react-native-linear-gradient';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const PhoneIcon = require('assets/icons/auth/phone.png');
const LockIcon = require('assets/icons/auth/lock.png');
const logoSrc = require('../../../assets/images/logo.png');

const LoginScreen = () => {
  const t = useTranslation();
  const { appNavigation } = useAppNavigate();
  const { lang, setLanguage } = useLanguageStore();
  const { fcmToken } = useAuthStore();
  const deviceInfo = useDeviceInfo();
  const { resetOnboarding } = useOnboardingStore();

  const { useRequestOTP } = useAuth();

  const { mutate: handleRequestOTP, isPending } = useRequestOTP;
  const loginSchema = LoginSchema();
  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // Only re-validate if fields are touched or have errors
  useEffect(() => {
    const hasInteracted = Object.keys(methods.formState.isSubmitted).length > 0;
    const hasErrors = Object.keys(methods.formState.errors).length > 0;

    if (hasInteracted || hasErrors) {
      methods.trigger();
    }
  }, [lang, methods.formState]);

  const { handleSubmit } = methods;

  // const onSubmit = handleSubmit((data) => {
  //   if (data.phone) {
  //     handleOnGenerateOtp(formatMyanmarPhoneNumber(data.phone));
  //     // handleOnVerifyUser({ phone: data.phone });
  //   }
  // });

  const onLogin = handleSubmit((data) => {
    appNavigation.navigate('OtpScreen');
  });

  return (
    <LinearGradient
      colors={['#3847BB', '#02107D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center' }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {/* <AuthHeader /> */}
      {/* <ScreenWrapper> */}
      <FormWrapper extraScrollHeight={75} wrapperStyle={{ flex: 1 }}>
        <View className='items-center' style={{ marginTop: HEIGHT / 10 }}>
          <Image source={logoSrc} style={{ width: WIDTH / 1.3 }} resizeMode="contain" />
        </View>

        <View className="flex px-5 gap-10 rounded-2xl">
          <FormProvider {...methods}>
            <FormInputLogin
              name="email"
              label={t.email}
              placeholder={t.typeYourEmail}
              // leftIcon={PhoneIcon}
              keyboardType="email-address"
              maxLength={50}
            />
            <LinearButton
              gradientClassName="h-12"
              style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
              onPress={onLogin}
              isLoading={isPending}
              disabled={isPending}
              variant={'outline'}
              outlineColor={'#FFFFFF'}
            >
              {/* {t.logIn} */}{'GET OTP'}
            </LinearButton>
          </FormProvider>
        </View>
      </FormWrapper>
      {/* </ScreenWrapper> */}
    </LinearGradient >
  );
};

export default LoginScreen;
