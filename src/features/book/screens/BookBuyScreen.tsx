import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions, TextInput } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Picker } from '@react-native-picker/picker'; // npm i @react-native-picker/picker
import { AppText, Header, LinearButton, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import { BookOpen, BookOpenText, ChevronRight, Headphones, Play, PlusCircle, X, ChevronDown, Copy } from 'lucide-react-native';
import { Book } from '../types';
import BookList from 'components/common/BookList';
import { PhotoOptionsModal } from 'components/photo-options/PhotoOptionsModal';
import FastImage from 'react-native-fast-image';
import { useBuyBook } from '../hooks/useBook';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookBuyScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const bookData = route.params?.bookDetail;

  const { mutate: handleBuyBook, isPending: isLoading } = useBuyBook();

  // Form states
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentSS, setPaymentSS] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // New form states
  const [transactionId, setTransactionId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('KBZPay'); // 'KBZPay' | 'wavepay'

  const handleImageSelected = (base64: string, asset: any) => {
    // console.log('PaymentSS image:', asset);
    setUploadError(null);
    setPaymentSS(asset);
  };

  const handleUploadError = (message: string) => {
    setUploadError(message);
  };

  // Validation
  const isTransactionValid = transactionId.length === 6 && /^\d{6}$/.test(transactionId);
  const isPaymentMethodSelected = !!selectedPaymentMethod;
  const isImageUploaded = !!paymentSS;

  const isSubmitDisabled = !isTransactionValid || !isPaymentMethodSelected || !isImageUploaded;

  const handleSubmit = useCallback(() => {
    if (isSubmitDisabled || !paymentSS) {
      handleUploadError('Payment Screenshot is required!')
      return;
    }

    try {
      const formData = new FormData();

      formData.append('book_id', bookData.id.toString());
      formData.append('payment_method', selectedPaymentMethod);
      formData.append('last_numbers', transactionId);

      if (paymentSS?.uri) {
        formData.append('screenshot', {
          uri: paymentSS.uri,
          type: paymentSS.type || 'image/jpeg',
          name: `payment-slip-${Date.now()}.jpg`,
        } as any);
      }

      handleBuyBook(formData);
    } catch (error) {
      console.error('SUBMIT ERROR:', error);
    }
  }, [bookData, transactionId, selectedPaymentMethod, paymentSS, isSubmitDisabled]);

  const phoneNumber = '09 960 620 488';
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const copyToClipboard = () => {
    Clipboard.setString(phoneNumber.replace(/\s/g, ''));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <ScreenWrapper
      header={<Header title={bookData.title} onBackPress={appNavigation.goBack} />}
      isScrollable
      isShowLoadingModal={isLoading}
    >
      {isLoading ? <></> :
        <View className="py-4 px-6 gap-4">
          {/* Book Info */}
          <View className="flex-row pb-6">
            <View className="w-2/5 mr-4">
              <Image
                source={{ uri: bookData.cover_image }}
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
                Author - {bookData.author.name}
              </AppText>
              <AppText language='mm' weight='bold' className="text-2xl text-primary">
                {bookData.price} Ks
              </AppText>
            </View>
          </View>

          {/* Payment Methods Dropdown */}
          <View className="">
            <AppText language='mm' weight='medium' className="text-base text-gray-900 mb-3">
              Payment Method
            </AppText>
            <View className="border border-gray-400 rounded-xl overflow-hidden bg-white">
              <Picker
                selectedValue={selectedPaymentMethod}
                onValueChange={(itemValue) => setSelectedPaymentMethod(itemValue)}
                style={{}}
                dropdownIconColor="#6B7280"
              >
                <Picker.Item label="MEP KBZ" value="KBZPay" />
                {/* <Picker.Item label="MEP Wave Money" value="Wave" /> */}
              </Picker>
            </View>
          </View>

          {/* Payment Info - Dynamic based on selection */}
          <View className="px-4 py-4 border border-gray-400 rounded-xl mb-4">
            <View className="flex-row items-center py-2">
              <Image
                source={{
                  uri: selectedPaymentMethod === 'KBZPay'
                    ? 'https://play-lh.googleusercontent.com/cnKJYzzHFAE5ZRepCsGVhv7ZnoDfK8Wu5z6lMefeT-45fTNfUblK_gF3JyW5VZsjFc4'
                    : 'https://play-lh.googleusercontent.com/rPq4GMCZy12WhwTlanEu7RzxihYCgYevQHVHLNha1VcY5SU1uLKHMd060b4VEV1r-OQ'
                }}
                className="w-10 h-10 rounded-lg ml-4 mr-10"
              />
              <View className="flex-1">
                <AppText weight='medium' className="text-sm mb-1">
                  Name - {selectedPaymentMethod === 'KBZPay' ? 'Sai Thang Vunga' : 'MEP Wave Money'}
                </AppText>
                {/* <AppText className="text-sm">
                  Phone No - {selectedPaymentMethod === 'KBZPay' ? '09 960 620 488' : '09 960 620 488'}
                </AppText> */}
                <View className="flex-row items-center justify-between">
                  <AppText className="text-sm flex-1">
                    Phone No - {selectedPaymentMethod === 'KBZPay' ? phoneNumber : phoneNumber}
                  </AppText>
                  <TouchableOpacity onPress={copyToClipboard} className="p-2">
                    <Copy
                      size={20}
                      color={isCopied ? "#10B981" : "#3B82F6"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Transaction ID - With validation */}
          <View className="mb-6">
            <AppText language='mm' weight='medium' className="text-base text-gray-900 mb-2">
              Transaction No/ID (6 digits)
            </AppText>
            <TextInput
              className={`h-16 px-4 border rounded-xl text-sm ${isTransactionValid
                ? 'border-green-500 bg-green-50'
                : transactionId.length > 0 && !isTransactionValid
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-400'
                }`}
              placeholder="ငွေလွှဲအမှတ်စဉ်၏ နောက်ဆုံးဂဏန်းခြောက်လုံးဖြည့်ပါ"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              value={transactionId}
              onChangeText={setTransactionId}
            />
            {transactionId.length > 0 && !isTransactionValid && (
              <AppText className="text-red-500 text-xs mt-1">
                ငွေလွှဲအမှတ်စဉ်၏ နောက်ဆုံးဂဏန်းခြောက်လုံးဖြည့်ပါ
              </AppText>
            )}
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
          {/* Upload Slip */}
          <View className="mb-6">
            <AppText language='mm' weight='medium' className="text-base text-gray-900 mb-3">
              Upload Slip
            </AppText>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="px-4 py-10 border-2 border-dashed border-gray-400 rounded-2xl items-center"
              disabled={isLoading}
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
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
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

          {/* Submit Button - Disabled when validation fails */}
          <LinearButton
            gradientClassName="h-12"
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            style={{
              width: WIDTH / 1.1,
              alignSelf: 'center',
              opacity: isSubmitDisabled ? 0.6 : 1
            }}
          >
            {isSubmitDisabled
              ? `Complete all fields (${isPaymentMethodSelected ? '✓' : '✗'} ${isTransactionValid ? '✓' : '✗'} ${isImageUploaded ? '✓' : '✗'})`
              : 'Submit Payment'
            }
          </LinearButton>

          <PhotoOptionsModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onImageSelected={handleImageSelected}
          // onError={handleUploadError}
          />
        </View>
      }
    </ScreenWrapper>
  );
};

export default BookBuyScreen;
