import { View, StatusBar, Image, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from 'components';
import { ChevronLeft } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';
import Searcher from 'components/common/Searcher';
import { useAuthStore } from 'store';
const logoSrc = require('../../../assets/images/logo.png');

type HomeHeaderProps = {
  title?: string;
};

const HomeHeader = ({ title }: HomeHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { appNavigation } = useAppNavigate();
  const { user } = useAuthStore();
  console.log('HomeHeader', user);


  return (
    <View className='mb-4'>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View
        style={{
          paddingTop: insets.top + 10,
          flexDirection: 'row',
          alignItems: 'center',  // ✅ Center vertically instead
          marginBottom: 10
        }}
      >
        <View className="flex-1">
          <AppText weight='bold' className="text-xs text-black/40 tracking-[2]">MEPPRESS</AppText>
          <AppText weight='bold' className="text-3xl text-primary">{user?.name}</AppText>
        </View>
        <View className='bg-primary p-2 rounded-full border-2 border-secondary'>
          <Image source={logoSrc} style={{ width: 35, height: 35 }} resizeMode="contain" />
        </View>
      </View>

      <Searcher
        // onSearch={(query) => query && console.log('Searching:', query)}
        onSearch={(query) => query && appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: query, searchKey: query } })}
        placeholder="Search for books, authors..."
      />
    </View>
  );
};

export default memo(HomeHeader);
