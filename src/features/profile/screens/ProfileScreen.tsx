import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { AppText, ConfirmModal, Header, ScreenWrapper } from 'components';
import { useAppNavigate, useTranslation } from 'hooks';
import { useRoute } from '@react-navigation/native';
import bookData from 'features/home/data/bookData';
import { Pencil, Mail, Phone, ChevronRight, UserRound, Earth, LogOutIcon, ChevronRightCircle, CircleUserRound } from 'lucide-react-native';
import { Profile } from '../types';
import FastImage from 'react-native-fast-image';
import { PhotoOptionsModal } from 'components/photo-options/PhotoOptionsModal';
import { useAuthStore } from 'store';
import { NavigationService } from 'navigation/NavigationService';
import { cn } from 'utils/helpers';
import { useGetUser } from '../hooks/useProfile';

const logoSrc = require('../../../assets/images/logo.png');
const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const ProfileScreen = () => {
  const { appNavigation } = useAppNavigate();
  const t = useTranslation();

  const { fcmToken, logout, isNotificationEnabled, setIsNotificationEnabled } = useAuthStore();

  const { data: userData, isPending } = useGetUser();

  const [edit, setEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>('');
  // const [name, setName] = useState('Andreas');
  // const [email, setEmail] = useState('andreas@mail.com');
  // const [phone, setPhone] = useState('+959199199199');
  const [profileData, setProfileData] = useState({
    user_id: '',
    name: '',
    email: '',
    avatar: '',
    auth_type: '',
    phone: ''
  });

  useEffect(() => {
    if (userData) {
      setProfileData({
        user_id: userData.user_id || '',
        name: userData.name || '',
        email: userData.email || '',
        avatar: userData.avatar || '',
        auth_type: userData.auth_type || '',
        phone: userData.phone || ''
      });
    }
  }, [userData]);

  // const fields = [
  //   { Icon: UserRound, value: name, setter: setName, placeholder: 'Enter name' },
  //   { Icon: Mail, value: email, setter: setEmail, placeholder: 'Enter email', keyboardType: 'email-address' },
  //   { Icon: Phone, value: phone, setter: setPhone, placeholder: 'Enter phone', keyboardType: 'phone-pad' }
  // ];
  const fields = [
    { Icon: UserRound, key: 'name' as const, placeholder: 'Enter name' },
    { Icon: Mail, key: 'email' as const, placeholder: 'Enter email', keyboardType: 'email-address' },
    // { Icon: Phone, key: 'phone' as const, placeholder: 'Enter phone', keyboardType: 'phone-pad' }
  ];

  // ✅ Dynamic update function
  const updateField = (key: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  const options = [
    { Icon: LogOutIcon, label: t.logout, onPress: () => setShowConfirmModal(true) },
  ];

  const handleOnLogout = useCallback(() => {
    // if (user?.id) {
    //   fetchLogoutMutation({
    //     device_id: deviceInfo.udid,
    //     fcm_token: fcmToken
    //   });
    // } else {
    logout();
    // setTimeout(() => {
    //   NavigationService.reset('AuthStack');
    // }, 500)
    // resetDatabase();
    // }
  }, []);

  const handleImageSelected = useCallback((base64: string, asset: any) => {
    setProfile(asset);
  }, []);

  const onSubmit = () => {
    setEdit(!edit);
  }

  return (
    <ScreenWrapper
      isShowLoadingModal={isPending}
      header={
        <Header
          title={"Profile"}
          onBackPress={appNavigation.goBack}
          showBackButton={false}
        // RightIcon={
        //   <TouchableOpacity onPress={onSubmit} className='bg-secondary rounded-full'>
        //     <AppText weight="medium" className="mx-3 text-white">
        //       {!edit && <Pencil size={11} color="white" />}
        //       {edit ? 'Done' : ' Edit'}
        //     </AppText>
        //   </TouchableOpacity>
        // }
        />
      }
    // isShowLoadingModal={isLoading}
    >
      {isPending ? <></> :
        <View className="pt-4 px-6">
          <View className="items-center mb-6">
            {/* <TouchableOpacity
              disabled={!edit}
              onPress={() => setModalVisible(true)}
              className="relative w-[100px] h-[100px] overflow-hidden self-center bg-[#D9D9D9] rounded-full justify-center items-center"
            >
              {profileData?.avatar ? (
                <FastImage
                  source={{
                    uri: `${profileData?.avatar}?t=${new Date().getTime()}`,
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
            {/* <Image
              source={{ uri: 'https://image.tmdb.org/t/p/w500/9MOY95jds58WtvEwUTYZgXlTVr0.jpg' }}
              className="w-24 h-24 rounded-full"
            /> */}
            {/* <CircleUserRound size={100} color="#02107D" /> */}
            <View className='bg-primary p-4 rounded-full border-4 border-secondary'>
              <Image source={logoSrc} style={{ width: 100, height: 100 }} resizeMode="contain" />
            </View>
            <AppText weight='semibold' className="text-lg mt-3 text-primary">ID: {`${profileData?.user_id}`}</AppText>
          </View>

          {/* {fields.map(({ Icon, value, setter, placeholder, keyboardType }, i) => (
            <View key={i} className="flex-row items-center justify-between py-4">
              <View className="flex-row items-center flex-1">
                <Icon size={20} />
                {edit ? (
                  <TextInput className="w-5/6 ml-7 px-5 text-base border border-gray-300 rounded-xl" value={value} onChangeText={setter} placeholder={placeholder} keyboardType={keyboardType as any} />
                ) : (
                  <AppText className="ml-5 mt-1 text-base">{value}</AppText>
                )}
              </View>
            </View>
          ))} */}
          {fields.map(({ Icon, key, placeholder, keyboardType }, i) => (
            <View key={i} className="flex-row items-center justify-between py-4 bg-gray-100 m-1 rounded-xl">
              <View className="flex-row items-center flex-1 px-4">
                <View className='bg-white p-3 rounded-xl'>
                  <Icon size={25} color='#02107D' />
                </View>
                {edit ? (
                  <TextInput
                    className="w-5/6 ml-7 px-5 text-base border border-gray-300 rounded-xl"
                    value={profileData[key]}           // ✅ Now shows "YeYe", "koye2@example.com"
                    onChangeText={(value) => updateField(key, value)}
                    placeholder={placeholder}
                    keyboardType={keyboardType as any}
                  />
                ) : (
                  <View>
                    <AppText weight='semibold' className="ml-5 uppercase text-xs text-gray-400">
                      {key}
                    </AppText>
                    <AppText weight='semibold' className="ml-5 text-lg text-primary">
                      {profileData[key] || placeholder}
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <Earth size={20} />
              <AppText className="ml-5 mt-1 text-base">Language</AppText>
            </View>
            <ChevronRight size={30} />
          </TouchableOpacity> */}

          <View className="w-full mt-5 self-center">
            {options.map(({ Icon, label, onPress }, index) => (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                className={cn(
                  'flex-row items-center justify-center bg-white rounded-2xl p-4 my-2 px-10',
                  'shadow-sm border border-gray-200'
                )}
                style={{
                  // iOS shadow
                  shadowColor: '#0580E2',
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                  // Android elevation
                  elevation: 4,
                  backgroundColor: '#ef4444'
                }}
              >
                <View className="flex-row items-center">
                  <Icon color='white' />
                  <AppText weight='semibold' className={cn('ml-5 text-lg text-white')}>{label}</AppText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      }

      <PhotoOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageSelected}
      />

      {
        showConfirmModal && (
          <ConfirmModal
            isVisible={showConfirmModal}
            title={t.are_you_sure_want_to_logout}
            onClose={() => setShowConfirmModal(false)}
            onSubmit={handleOnLogout}
            confirmText={t.logout}
          />
        )
      }
    </ScreenWrapper>
  );
};

export default ProfileScreen;
