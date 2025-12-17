import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { AppText, Header, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import bookData from 'features/home/data/bookData';
import { Pencil, Mail, Phone, ChevronRight, UserRound, Earth } from 'lucide-react-native';
import { Profile } from '../types';
import FastImage from 'react-native-fast-image';
import { PhotoOptionsModal } from 'components/photo-options/PhotoOptionsModal';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const ProfileScreen = () => {
  const { appNavigation } = useAppNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState<any>('');
  const [name, setName] = useState('Andreas');
  const [email, setEmail] = useState('andreas@mail.com');
  const [phone, setPhone] = useState('+959199199199');

  const fields = [
    { Icon: UserRound, value: name, setter: setName, placeholder: 'Enter name' },
    { Icon: Mail, value: email, setter: setEmail, placeholder: 'Enter email', keyboardType: 'email-address' },
    { Icon: Phone, value: phone, setter: setPhone, placeholder: 'Enter phone', keyboardType: 'phone-pad' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageSelected = useCallback((base64: string, asset: any) => {
    setProfile(asset);
  }, []);

  const onSubmit = () => {
    setEdit(!edit);
  }

  return (
    <ScreenWrapper
      header={
        <Header
          title={"Profile"}
          onBackPress={appNavigation.goBack}
          showBackButton={false}
          RightIcon={
            <TouchableOpacity onPress={onSubmit} className='bg-secondary rounded-full'>
              <AppText weight="medium" className="mx-3 text-white">
                {!edit && <Pencil size={11} color="white" />}
                {edit ? 'Done' : ' Edit'}
              </AppText>
            </TouchableOpacity>
          }
        />
      }
      isShowLoadingModal={isLoading}
    >
      {isLoading ? <></> :
        <View className="pt-4 px-6">
          <View className="items-center mb-6">
            <TouchableOpacity
              disabled={!edit}
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
            {/* <Image
              source={{ uri: 'https://image.tmdb.org/t/p/w500/9MOY95jds58WtvEwUTYZgXlTVr0.jpg' }}
              className="w-24 h-24 rounded-full"
            /> */}
            <AppText weight='semibold' className="text-lg mt-3">ID: 0123456789</AppText>
          </View>

          {fields.map(({ Icon, value, setter, placeholder, keyboardType }, i) => (
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
          ))}

          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <Earth size={20} />
              <AppText className="ml-5 mt-1 text-base">Language</AppText>
            </View>
            <ChevronRight size={30} />
          </TouchableOpacity>
        </View>
      }

      <PhotoOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageSelected}
      />
    </ScreenWrapper>
  );
};

export default ProfileScreen;
