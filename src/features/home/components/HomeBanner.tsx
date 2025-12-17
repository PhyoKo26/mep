import { View, StatusBar, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from 'components';
import { ChevronLeft } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';
import { LogoIcon } from 'assets/svg';
const bannerSrc = require('../../../assets/images/banner.png');
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

type HomeBannerProps = {
  title?: string;
};

const HomeBanner = ({ title }: HomeBannerProps) => {
  const insets = useSafeAreaInsets();
  const { appNavigation } = useAppNavigate();

  return (
    <View className='flex items-center'>
      {/* <TouchableOpacity onPress={onPressSave}> */}
      {/* <Image source={isSaved ? saveFill : save} resizeMode="contain" className="w-6 h-6 m-2" /> */}
      <Image source={bannerSrc} style={{ width: WIDTH - 48, height: HEIGHT / 2, borderRadius: 10 }} resizeMode="contain" />
      {/* </TouchableOpacity> */}
    </View>
  );
};

export default memo(HomeBanner);
