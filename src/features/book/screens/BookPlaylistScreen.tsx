import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { AppText, Header, LinearButton, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import { PlayCircle } from 'lucide-react-native';
import { Book } from '../types';
import BookList from 'components/common/BookList';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookPlaylistScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const { bookDetail } = route.params || {};
  const { title, image, author, audioUrl } = bookDetail as Book;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayTrack = (track: any) => {
    appNavigation.navigate('BookPlayScreen', {
      bookDetail: {
        title: track.name,
        image: image,
        author: author,
        audioUrl: track.url
      }
    });
  };

  return (
    <ScreenWrapper isShowLoading={isLoading} header={<Header title={title} onBackPress={appNavigation.goBack} />}>
      <View className="flex-row p-6">
        <View className="w-2/5 mr-4">
          <Image
            source={{ uri: image }}
            style={{ width: '100%', height: WIDTH / 2.2 }}
            className="rounded-2xl"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 justify-center">
          <AppText language='mm' weight='bold' className="text-xl mb-2">
            {title}
          </AppText>
          <AppText language='mm' className="text-base mb-3 text-gray-600">
            Author - {author}
          </AppText>
        </View>
      </View>

      <FlatList
        data={audioUrl}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            className="flex-row items-center px-6 py-4 border-b border-gray-200"
            onPress={() => handlePlayTrack(item)}
          >
            <View className="w-12 h-12 bg-secondary rounded-lg mr-4 justify-center items-center">
              <AppText className="text-white font-bold">▶</AppText>
            </View>
            <View className="flex-1">
              <AppText weight="medium">{item.name}</AppText>
              <AppText className="text-sm text-gray-500">{item.url.split('/').pop()}</AppText>
            </View>
            <PlayCircle size={24} color="#3847BB" />
          </TouchableOpacity>
        )}
        keyExtractor={(item: any) => item.url}
      />
    </ScreenWrapper>
  );
};

export default BookPlaylistScreen;
