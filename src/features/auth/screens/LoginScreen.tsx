import React, { useCallback, useEffect } from 'react';
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
import { LoginRequest } from 'types/api.request';

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

  const { useLogin } = useAuth();

  const { mutate: handleLogin, isPending } = useLogin;
  const loginSchema = LoginSchema();
  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
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

  // const onLogin = handleSubmit((data) => {
  //   // appNavigation.navigate('OtpScreen');
  // });

  const onLogin = useCallback(
    handleSubmit(({ email, password }) => {
      const reqBody: LoginRequest = {
        email,
        password,
      };
      handleLogin(reqBody);
    }),
    [handleSubmit]
  );

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
        <View className='items-center' style={{ marginVertical: HEIGHT / 10 }}>
          <Image source={logoSrc} style={{ width: WIDTH / 1.3, height: WIDTH / 4 }} resizeMode="contain" />
        </View>

        <View className="flex px-5 gap-5 rounded-2xl">
          <FormProvider {...methods}>
            <FormInputLogin
              name="email"
              label={t.email}
              placeholder={t.typeYourEmail}
              // leftIcon={PhoneIcon}
              keyboardType="email-address"
              maxLength={50}
            />
            <FormInputLogin
              name="password"
              label={t.password}
              placeholder={t.typeYourPassword}
              // leftIcon={LockIcon}
              keyboardType="default"
              maxLength={50}
              isPassword={true}
            />
            <LinearButton
              gradientClassName="h-12"
              style={{ width: WIDTH / 1.1, alignSelf: 'center', marginTop: 24 }}
              onPress={onLogin}
              isLoading={isPending}
              disabled={isPending}
              // variant={'outline'}
              // outlineColor={'#FFFFFF'}
              colors={['#FFCC00', '#FFB800']}
              textClassName="text-black text-base"
            >
              {t.logIn}
              {/* {'GET OTP'} */}
            </LinearButton>
          </FormProvider>

          <View className="items-center gap-8 mt-6">
            <AppText className="text-white text-base"
            // onPress={handleOnPressForgotPassword}
            >
              Forgot Password?
            </AppText>
            <AppText className="text-white text-base">
              {`Don't have an account? `}
              <AppText weight='bold' className="text-white text-base"
                onPress={() => appNavigation.navigate('RegisterStack')}
              >
                Sign Up
              </AppText>
            </AppText>
          </View>
        </View>
      </FormWrapper>
      {/* </ScreenWrapper> */}
    </LinearGradient >
  );
};

export default LoginScreen;
