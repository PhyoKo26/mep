import React from 'react';
import {
  ActivityIndicator,
  View,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { AppText, Header, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import { BookOpenText } from 'lucide-react-native';
import { Book } from '../types';
import {
  useGetAllBook,
  useGetBookByAuthorId,
  useGetBookByGroupId,
  useGetBookBySearchKey,
} from '../hooks/useBook';
import queryClient from 'utils/queryClient';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookListsScreen = ({ hideHeader }: any) => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();

  const title = route.params?.title;
  const groupId = route.params?.groupId;
  const authorId = route.params?.authorId;
  const searchKey = route.params?.searchKey;

  // ✅ Determine mode
  const isSearch = !!searchKey;
  const isAuthor = !!authorId && !searchKey;
  const isGroup = !!groupId && !searchKey && !authorId;

  const getQueryKey = () => {
    if (isSearch) return ['booksBySearch', searchKey];
    if (isAuthor) return ['booksByAuthor', authorId];
    if (isGroup) return ['booksByGroup', groupId];
    return ['book-lists'];
  };

  const pageLimit = 10;

  // ✅ Use ONLY ONE query
  const query = isSearch
    ? useGetBookBySearchKey({ search: searchKey, limit: pageLimit })
    : isAuthor
      ? useGetBookByAuthorId({ id: authorId, limit: pageLimit })
      : isGroup
        ? useGetBookByGroupId({ list_id: groupId, limit: pageLimit })
        : useGetAllBook({ limit: pageLimit });

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = query;

  // ✅ Normalize data (important)
  const books = data?.pages.flatMap(p => p.data) || [];

  // ✅ Refresh
  const onRefresh = () => {
    queryClient.resetQueries({ queryKey: getQueryKey() });
  };

  // ✅ Load more
  const loadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const renderBookCard = ({ item }: { item: Book }) => (
    <TouchableOpacity
      className="mb-4"
      onPress={() =>
        appNavigation.navigate('BookStack', {
          screen: 'BookDetailScreen',
          params: { id: item.id },
        })
      }
      style={{ width: '47%' }}
    >
      <Image
        source={{
          uri:
            item.cover_image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.description
            )}&size=128&background=4F46E5&color=fff`,
        }}
        style={{ width: '100%', height: WIDTH / 1.7 }}
        className="rounded-lg mb-2"
        resizeMode="cover"
      />
      <AppText language="mm" weight="semibold" className="text-sm line-clamp-1">
        {item.title}
      </AppText>
      {item.author_name && (
        <AppText className="text-xs mb-1">{item.author_name}</AppText>
      )}
      <AppText weight="semibold" className="text-xs text-gray-600">
        {item.price} Ks
      </AppText>
    </TouchableOpacity>
  );

  const emptyBook = () => (
    <View className="flex-1 justify-center items-center pt-[30%] px-6">
      <View className="w-24 h-24 bg-blue-100 rounded-3xl items-center justify-center">
        <BookOpenText size={56} color="#6366F1" strokeWidth={2} />
      </View>

      <AppText className="text-center mt-6 text-lg font-semibold">
        No Books Found
      </AppText>

      <AppText className="text-center mt-3 text-gray-500">
        {isLoading
          ? 'Loading books...'
          : isGroup
            ? `No books in group "${title}"`
            : isAuthor
              ? `No books by author "${title}"`
              : `No books available`}
      </AppText>
    </View>
  );

  return (
    <ScreenWrapper
      header={!hideHeader &&
        <Header
          title={title || 'Books'}
          showBackButton={!!title}
          onBackPress={appNavigation.goBack}
        />
      }
      isShowLoadingModal={isLoading} hidePaddingBottom={!title}
    >
      {!isLoading && (
        <View className="pt-4 px-6">
          <FlatList
            contentContainerStyle={{ flexGrow: 1, paddingBottom: hasNextPage ? 65 : 0 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            data={books}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBookCard}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyBook}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !hasNextPage}
                onRefresh={onRefresh}
                colors={['#086AB8']}
                tintColor="#086AB8"
              />
            }
            ListFooterComponent={
              isFetching && hasNextPage ? (
                <View style={{ paddingVertical: 10 }}>
                  <ActivityIndicator size="large" color="#086AB8" />
                </View>
              ) : null
            }
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default BookListsScreen;