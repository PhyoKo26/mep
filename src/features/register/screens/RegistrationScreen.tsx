import React, { memo, useState, useCallback } from 'react';
import { TouchableOpacity, View, Image, Dimensions, StatusBar } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import FastImage from 'react-native-fast-image';
import { AppText, Header, LinearButton, ScreenWrapper } from 'components';
import { FormInput, FormInputLogin, FormWrapper } from 'components/form';
import { PhotoOptionsModal } from 'components/photo-options/PhotoOptionsModal';
import { useAppNavigate, useTranslation } from 'hooks';
import { RegisterSchema, RegistrationSchemaType } from '../validation/registrationSchema';
import { zodResolver } from 'utils/zodResolver';
import { useCreateUser } from '../hooks/useOnboarding';
import { CreateUserRequest } from 'types/api.request';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const logoSrc = require('../../../assets/images/logo.png');

const RegistrationScreen = () => {
  const t = useTranslation();
  const insets = useSafeAreaInsets();
  const { appNavigation } = useAppNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState<any>('');

  const { mutate: handleOnCreate, isPending } = useCreateUser();

  const methods = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      profile: '',
      password: '',
      confirmpwd: '',
    },
  });

  const { handleSubmit, setValue, clearErrors, formState } = methods;

  const handleImageSelected = useCallback((base64: string, asset: any) => {
    setProfile(asset);
    setValue('profile', asset, { shouldValidate: true });
    clearErrors('profile');
  }, [setValue, clearErrors]);

  const onSubmit = useCallback(
    handleSubmit(({ name, email, phone, password, confirmpwd }) => {
      console.log({ name, email, phone, password, confirmpwd, profile });
      const reqBody: CreateUserRequest = {
        name,
        email,
        password,
      };
      handleOnCreate(reqBody);
    }),
    [handleSubmit, profile]
  );

  return (
    <LinearGradient
      colors={['#3847BB', '#02107D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center' }}
    >
      <ScreenWrapper
        header={
          <Header
            title={'Registration'}
            titleClassName="text-white text-center"
            onBackPress={appNavigation.goBack}
            iconColor="white"
          />}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <FormWrapper wrapperStyle={{ flex: 1 }}>
          <View className='items-center' style={{ marginVertical: 10 }}>
            <Image source={logoSrc} style={{ width: WIDTH / 1.3, height: WIDTH / 4 }} resizeMode="contain" />
          </View>
          <View className="flex-1 gap-3 pb-10 px-6">
            {/* Avatar */}
            {/* <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="relative w-[100px] h-[100px] overflow-hidden self-center bg-[#D9D9D9] rounded-full justify-center items-center"
          >
            {profile ? (
              <FastImage
                source={{
                  uri: `${profile?.uri}?t=${new Date().getTime()}`,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.web,
                }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <FastImage
                source={require('assets/images/profile.png')}
                style={{ width: 42, height: 42, borderRadius: 50, backgroundColor: '#D9D9D9' }}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </TouchableOpacity> */}
            {/* <View className="flex justify-center items-center rounded-full">
            <AppText className="font-semibold text-lg tracking-wide">Add Your Photo</AppText>
          </View>
          {typeof formState.errors.profile?.message === 'string' && (
            <AppText style={{ color: 'red', textAlign: 'center' }}>
              {formState.errors.profile.message}
            </AppText>
          )} */}

            <FormProvider {...methods}>
              <View className="gap-5 pb-8 mt-5">
                <FormInputLogin
                  name="name"
                  label={t.name}
                  placeholder={t.typeYourEmail}
                  // leftIcon={PhoneIcon}
                  keyboardType="email-address"
                  maxLength={50}
                />
                <FormInputLogin
                  name="email"
                  label={t.email}
                  placeholder={t.typeYourEmail}
                  // leftIcon={PhoneIcon}
                  keyboardType="email-address"
                  maxLength={50}
                />
                {/* <FormInput
                name="phone"
                label="Phone Number"
                placeholder="09xxxxxxxxx"
                keyboardType="phone-pad"
                maxLength={11}
              /> */}

                <FormInputLogin
                  name="password"
                  label={t.password}
                  placeholder={t.typeYourPassword}
                  // leftIcon={LockIcon}
                  keyboardType="default"
                  maxLength={50}
                  isPassword={true}
                />
                <FormInputLogin
                  name="confirmpwd"
                  label={t.confirmPassword}
                  placeholder={t.typeYourPassword}
                  // leftIcon={LockIcon}
                  keyboardType="default"
                  maxLength={50}
                  isPassword={true}
                />

                <LinearButton
                  gradientClassName="h-12"
                  className="mt-5"
                  onPress={onSubmit}
                  isLoading={isPending}
                  disabled={isPending}
                  colors={['#FFCC00', '#FFB800']}
                  textClassName="text-black text-base"
                >
                  {`Register`}
                </LinearButton>
              </View>
            </FormProvider>

            <View className="items-center mt-4">
              <AppText className="text-white text-base">
                {`Already have an account? `}
                <AppText weight='bold' className="text-white text-base"
                  onPress={() => appNavigation.navigate('AuthStack', { screen: 'LoginScreen' })}
                >
                  Log In
                </AppText>
              </AppText>
            </View>
          </View>

          <PhotoOptionsModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onImageSelected={handleImageSelected}
          />
        </FormWrapper>
      </ScreenWrapper>
    </LinearGradient>
  );
};

export default memo(RegistrationScreen);
