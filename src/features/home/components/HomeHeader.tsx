import { View, StatusBar, Image, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from 'components';
import { ChevronLeft } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';
import { LogoIcon } from 'assets/svg';
const logoSrc = require('../../../assets/images/homelogo.png');

type HomeHeaderProps = {
  title?: string;
};

const HomeHeader = ({ title }: HomeHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { appNavigation } = useAppNavigate();

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View
        style={{
          paddingTop: insets.top + 10,
          // justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        {/* <LogoIcon /> */}
        {/* <Image source={logoSrc} style={{ width: 136, height: 46 }} resizeMode="contain" /> */}
        <AppText weight='bold' className="text-lg">{`MEPPRESS`}</AppText>
        {/* <TouchableOpacity onPress={onPressSave}>
          <Image source={isSaved ? saveFill : save} resizeMode="contain" className="w-6 h-6 m-2" />
        </TouchableOpacity> */}
      </View>
    </>
  );
};

export default memo(HomeHeader);
