import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions, RefreshControl } from 'react-native';
import { AppText, Header, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import bookData from 'features/home/data/bookData';
import { BookOpenText, ChevronRight } from 'lucide-react-native';
import { Book } from '../types';
import { useGetBookByAuthorId, useGetBookByGroupId, useGetBookBySearchKey } from '../hooks/useBook';
import queryClient from 'utils/queryClient';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookListsScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const title = route.params?.title;
  const groupId = route.params?.groupId;
  const authorId = route.params?.authorId;
  const searchKey = route.params?.searchKey;

  const pageLimit = 10;
  const {
    data: booksByGroup,
    isLoading: isGroupLoading,
    isFetching: groupFetching,
    fetchNextPage: groupLoadMore,
    hasNextPage: groupHasNext,
  } = useGetBookByGroupId({
    list_id: groupId,
    limit: pageLimit
  });

  const {
    data: booksByAuthor,
    isLoading: isAuthorLoading,
    isFetching: authorFetching,
    fetchNextPage: authorLoadMore,
    hasNextPage: authorHasNext,
  } = useGetBookByAuthorId({
    id: authorId,
    limit: pageLimit
  });

  const {
    data: booksBySearch,
    isLoading: isSearchLoading,
    isFetching: searchFetching,
    fetchNextPage: searchLoadMore,
    hasNextPage: searchHasNext,
  } = useGetBookBySearchKey({
    search: searchKey,
    limit: pageLimit
  });

  const isAnyLoading = isGroupLoading || isAuthorLoading || isSearchLoading;
  const isAnyFetching = groupFetching || authorFetching || searchFetching;
  const hasAnyNextPage = groupHasNext || authorHasNext || searchHasNext;

  const books = [
    ...(booksByGroup?.pages.flatMap(p => p.data.books) || []),
    ...(booksByAuthor?.pages.flatMap(p => p.data.books) || []),
    ...(booksBySearch?.pages.flatMap(p => p.data) || [])
  ];

  const onRefresh = () => {
    if (groupId) queryClient.resetQueries({ queryKey: ['booksByGroup'] });
    if (authorId) queryClient.resetQueries({ queryKey: ['booksByAuthor'] });
    if (searchKey) queryClient.resetQueries({ queryKey: ['booksBySearch'] });
  };

  const loadMore = () => {
    if (groupId && groupHasNext && !groupFetching) {
      groupLoadMore();
    } else if (authorId && authorHasNext && !authorFetching) {
      authorLoadMore();
    } else if (searchKey && searchHasNext && !searchFetching) {
      searchLoadMore();
    }
  };

  const renderBookCard = ({ item, index }: { item: Book; index: number }) => {
    return (
      <TouchableOpacity
        className={`mb-4`}
        onPress={() => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: item.id } })}
        style={{ width: '47%' }}
      >
        <Image
          source={{
            uri: item.cover_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.description)}&size=128&background=4F46E5&color=fff`
          }}
          style={{ width: '100%', height: WIDTH / 1.7 }}
          className="rounded-lg mb-2"
          resizeMode="cover"
        />
        <AppText language='mm' weight='semibold' className="text-sm line-clamp-1">
          {item.title}
        </AppText>
        {item.author_name && <AppText className="text-xs mb-1">{item.author_name}</AppText>}
        <AppText weight='semibold' className="text-xs text-gray-600">
          {item.price} Ks
        </AppText>
      </TouchableOpacity>
    )
  };

  const emptyBook = () => (
    <View className="flex-1 justify-center items-center pt-[30%] px-6 bg-gradient-to-b from-slate-50 to-white">
      <View className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl items-center justify-center shadow-xl border-4 border-white">
        <BookOpenText size={56} color="#6366F1" strokeWidth={2} />
      </View>
      <AppText className="text-slate-800 text-center mt-6 text-xl font-semibold tracking-wide">
        No Books Found
      </AppText>
      <AppText className="text-slate-600 text-center mt-3 px-4 leading-relaxed bg-white/80 py-3 px-6 rounded-2xl shadow-sm border border-slate-200">
        {isAnyLoading
          ? 'Loading books...'
          : groupId
            ? `No books in group "${title}"`
            : authorId
              ? `No books by author "${title}"`
              : `No books available for "${title}"`
        }
      </AppText>

      {/* Optional: Retry button */}
      {/* {!isAnyLoading && books.length === 0 && (
        <TouchableOpacity
          onPress={onRefresh}
          className="mt-6 px-6 py-2 bg-primary rounded-lg"
        >
          <AppText className="text-white text-sm font-medium">
            Try Again
          </AppText>
        </TouchableOpacity>
      )} */}
    </View>
  )

  return (
    <ScreenWrapper
      header={<Header title={title} onBackPress={appNavigation.goBack} />}
      isShowLoadingModal={isAnyLoading}
    >
      {isAnyLoading ? <></> :
        <View className="pt-4 px-6">
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            data={books}
            numColumns={2}
            keyExtractor={item => item.id.toString()}
            renderItem={renderBookCard}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyBook}
            refreshControl={
              <RefreshControl
                refreshing={isAnyFetching && !hasAnyNextPage && !isAnyLoading}
                onRefresh={onRefresh}
                colors={['#086AB8']}
                tintColor="#086AB8"
              />
            }
            ListFooterComponent={
              isAnyFetching && hasAnyNextPage ? (
                <View style={{ paddingVertical: 10 }}>
                  <ActivityIndicator size="large" color="#086AB8" />
                </View>
              ) : null
            }
          />
        </View>
      }
    </ScreenWrapper>
  );
};

export default BookListsScreen;
