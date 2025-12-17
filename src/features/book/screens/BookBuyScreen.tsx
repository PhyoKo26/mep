import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { AppText, Header, LinearButton, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import { BookOpen, BookOpenText, ChevronRight, Headphones, Play, PlusCircle, X } from 'lucide-react-native';
import { Book } from '../types';
import BookList from 'components/common/BookList';
import { PhotoOptionsModal } from 'components/photo-options/PhotoOptionsModal';
import FastImage from 'react-native-fast-image';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookBuyScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const bookData = route.params?.bookDetail;

  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentSS, setPaymentSS] = useState<any>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelected = (base64: string, asset: any) => {
    console.log('PaymentSS image:', asset);
    setUploadError('');
    setPaymentSS(asset);
  };

  const handleUploadError = (message: string) => {
    setUploadError(message);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper
      header={<Header title={bookData.title} onBackPress={appNavigation.goBack} />}
      isScrollable
      isShowLoadingModal={isLoading}
    >
      {isLoading ? <></> :
        <View className="py-4 px-6 gap-4">
          <View className="flex-row pb-6">
            <View className="w-2/5 mr-4">
              <Image
                source={{ uri: bookData.image }}
                style={{ width: '100%', height: WIDTH / 2.2 }}
                className="rounded-2xl"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 justify-center">
              <AppText language='mm' weight='bold' className="text-xl mb-2">
                {bookData.title}
              </AppText>
              <AppText language='mm' className="text-base mb-3 text-gray-600">
                Author - {bookData.author}
              </AppText>
              <AppText language='mm' weight='bold' className="text-2xl text-primary">
                {bookData.price} Ks
              </AppText>
            </View>
          </View>

          <View className="px-4 py-4 border border-gray-400 rounded-xl mb-4">
            <View className="flex-row items-center py-4">
              <Image
                source={{ uri: 'https://play-lh.googleusercontent.com/cnKJYzzHFAE5ZRepCsGVhv7ZnoDfK8Wu5z6lMefeT-45fTNfUblK_gF3JyW5VZsjFc4' }}
                className="w-10 h-10 rounded-lg ml-4 mr-10"
              />
              <View className="flex-1">
                <AppText weight='medium' className="text-sm mb-1">Name - MEP KBZ</AppText>
                <AppText className="text-sm">Phone No - 09 123 456 789</AppText>
              </View>
            </View>

            <View className="flex-row items-center py-4 border-t border-gray-200">
              <Image
                source={{ uri: 'https://play-lh.googleusercontent.com/rPq4GMCZy12WhwTlanEu7RzxihYCgYevQHVHLNha1VcY5SU1uLKHMd060b4VEV1r-OQ' }}
                className="w-10 h-10 rounded-lg ml-4 mr-10"
              />
              <View className="flex-1">
                <AppText weight='medium' className="text-sm mb-1">Name - MEP Wave Money</AppText>
                <AppText className="text-sm">Phone No - 09 987 654 321</AppText>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <AppText language='mm' weight='medium' className="text-base text-gray-900 mb-2">
              Transaction No/ID
            </AppText>
            <TextInput
              className="h-16 px-4 border border-gray-400 rounded-xl text-sm"
              placeholder="ငွေလွှဲအမှတ်စဉ်၏ နောက်ဆုံးဂဏန်းခြောက်လုံးဖြည့်ပါ"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          {/* <View className="mb-2">
            <AppText language='mm' weight='medium' className="text-base text-gray-900 mb-2">
              Upload Slip
            </AppText>
            <TouchableOpacity onPress={() => setModalVisible(true)} className="px-4 py-10 border border-gray-400 rounded-xl mb-4 items-center">
              <PlusCircle size={40} color={'#fff'} fill={'#000'} />
              <AppText weight='medium' className="text-sm text-gray-900 mt-4">
                Upload Image
              </AppText>
            </TouchableOpacity>
            {paymentSS && (
              <TouchableOpacity
                disabled
                onPress={() => setModalVisible(true)}
                className="relative w-[55%] aspect-[0.7] overflow-hidden self-center bg-[#D9D9D9] rounded-lg justify-center items-center"
              >
                <FastImage
                  source={{
                    uri: `${paymentSS?.uri}?t=${new Date().getTime()}`,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.web
                  }}
                  style={{ width: '100%', aspectRatio: 0.7, borderRadius: 8, backgroundColor: '#D9D9D9' }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            )}
            {uploadError && (
              <AppText style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>
                {uploadError}
              </AppText>
            )}
          </View> */}
          <View className="mb-6">
            <AppText language='mm' weight='medium' className="text-base text-gray-900 mb-3">
              Upload Slip
            </AppText>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="px-4 py-10 border-2 border-dashed border-gray-400 rounded-2xl items-center"
            >
              {!paymentSS ? (
                <>
                  <PlusCircle size={40} color={'#fff'} fill={'#000'} />
                  <AppText weight='medium' className="text-sm text-gray-900 mt-4">
                    Upload Image
                  </AppText>
                </>
              ) : (
                <View className="relative w-[55%] aspect-[3/4] overflow-hidden rounded-xl bg-gray-200">
                  <FastImage
                    source={{
                      uri: `${paymentSS?.uri}?t=${new Date().getTime()}`,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.web
                    }}
                    style={{ flex: 1 }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-white rounded-full p-1"
                    onPress={() => setPaymentSS(null)}
                  >
                    <X size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>

            {uploadError && (
              <AppText className="text-red-500 text-sm text-center mt-2">
                {uploadError}
              </AppText>
            )}
          </View>

          <LinearButton
            gradientClassName="h-12"
            onPress={() => console.log('BUY')}
            style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
          // isLoading={isPending}
          // disabled={isPending}
          >
            Submit
          </LinearButton>

          <PhotoOptionsModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onImageSelected={handleImageSelected}
          />
        </View>
      }
    </ScreenWrapper>
  );
};

export default BookBuyScreen;
