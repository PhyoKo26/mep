import React, { memo, useState, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import FastImage from 'react-native-fast-image';

import { AppText, Header, LinearButton, ScreenWrapper } from 'components';
import { FormInput, FormWrapper } from 'components/form';
import { PhotoOptionsModal } from 'components/photo-options/PhotoOptionsModal';
import { useAppNavigate } from 'hooks';
import { RegisterSchema, RegistrationSchemaType } from '../validation/registrationSchema';
import { zodResolver } from 'utils/zodResolver';

const RegistrationScreen = () => {
  const { appNavigation } = useAppNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState<any>('');

  const methods = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      profile: '',
    },
  });

  const { handleSubmit, setValue, clearErrors, formState } = methods;

  const handleImageSelected = useCallback((base64: string, asset: any) => {
    setProfile(asset);
    setValue('profile', asset, { shouldValidate: true });
    clearErrors('profile');
  }, [setValue, clearErrors]);

  const onSubmit = useCallback(
    handleSubmit(({ name, email, phone }) => {
      // handle registration submit here
      console.log({ name, email, phone, profile });
    }),
    [handleSubmit, profile]
  );

  return (
    <ScreenWrapper
      header={<Header title={'Registration'} onBackPress={appNavigation.goBack} />}
    >
      <FormWrapper wrapperStyle={{ flex: 1 }}>
        <View className="flex-1 mt-5 gap-3 pb-10 px-6">
          {/* Avatar */}
          <TouchableOpacity
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
          </TouchableOpacity>
          <View className="flex justify-center items-center rounded-full">
            <AppText className="font-semibold text-lg tracking-wide">Add Your Photo</AppText>
          </View>
          {typeof formState.errors.profile?.message === 'string' && (
            <AppText style={{ color: 'red', textAlign: 'center' }}>
              {formState.errors.profile.message}
            </AppText>
          )}

          <FormProvider {...methods}>
            <View className="gap-5 pb-8 mt-5">
              <FormInput
                name="name"
                label="Name"
                placeholder="Type your name"
                maxLength={50}
              />
              <FormInput
                name="email"
                label="Email"
                placeholder="example@gmail.com"
                keyboardType="email-address"
              />
              <FormInput
                name="phone"
                label="Phone Number"
                placeholder="09xxxxxxxxx"
                keyboardType="phone-pad"
                maxLength={11}
              />

              <LinearButton
                gradientClassName="h-12"
                className="mt-5"
                onPress={onSubmit}
              >
                Register
              </LinearButton>
            </View>
          </FormProvider>
        </View>

        <PhotoOptionsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onImageSelected={handleImageSelected}
        />
      </FormWrapper>
    </ScreenWrapper>
  );
};

export default memo(RegistrationScreen);
