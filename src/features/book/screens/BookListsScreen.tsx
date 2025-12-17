import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { AppText, Header, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import bookData from 'features/home/data/bookData';
import { ChevronRight } from 'lucide-react-native';
import { Book } from '../types';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookListsScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const title = route.params?.title;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderBookCard = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity
      className={`mb-4`}
      onPress={() => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: item.id } })}
      style={{ width: '47%' }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: '100%', height: WIDTH / 1.7 }}
        className="rounded-lg mb-2"
        resizeMode="cover"
      />
      <AppText language='mm' weight='semibold' className="text-sm line-clamp-1">
        {item.title}
      </AppText>
      <AppText className="text-xs mb-1">{item.author}</AppText>
      <AppText weight='semibold' className="text-xs text-gray-600">
        {item.price} Ks
      </AppText>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      header={<Header title={title} onBackPress={appNavigation.goBack} />}
      isShowLoadingModal={isLoading}
    >
      {isLoading ? <></> :
        <View className="pt-4 px-6">
          <FlatList
            data={bookData as any}
            numColumns={2}
            renderItem={renderBookCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </View>
      }
    </ScreenWrapper>
  );
};

export default BookListsScreen;
