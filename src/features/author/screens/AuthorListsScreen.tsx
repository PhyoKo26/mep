import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions, RefreshControl } from 'react-native';
import { AppText, Header, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import { Author } from '../types';
import authorData from 'features/home/data/authorData';
import { useGetAllAuthors } from '../hooks/useAuthor';
import PostSkeleton from '../components/PostSkeleton';
import queryClient from 'utils/queryClient';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const AuthorListsScreen = ({ hideHeader }: any) => {
  const { appNavigation } = useAppNavigate();

  const pageLimit = 20;
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetAllAuthors({ limit: pageLimit });

  const authors = data?.pages.flatMap(page => page.data) ?? [];

  // console.log('useGetAllAuthors', authors);

  const onRefresh = () => {
    // if (!deviceInfo.udid) return;
    queryClient.removeQueries({
      queryKey: ['all-authors'],
      // exact: true,
    });
    refetch();
  };

  const loadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const renderAuthorCard = ({ item, index }: { item: Author; index: number }) => (
    <TouchableOpacity
      className={`flex-row px-6 py-4 my-2 rounded-xl bg-black/10`}
      onPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: item.name, authorId: item.id } })}
    // style={{ width: '30%' }}
    >
      <Image
        source={{
          uri: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=128&background=4F46E5&color=fff`
        }}
        className="w-20 h-20 rounded-full bg-white"
        resizeMode="contain"
      />
      <View className='ml-4 justify-center'>
        <AppText language='mm' weight='semibold' className="text-lg line-clamp-1">
          {item.name}
        </AppText>
        <AppText className="line-clamp-1">
          {item.total_books} {item.total_books === 1 ? 'Book' : 'Books'} Available
        </AppText>
      </View>
    </TouchableOpacity>
  );
  // const renderAuthorCard = ({ item, index }: { item: Author; index: number }) => (
  //   <TouchableOpacity
  //     className="mb-4"
  //     onPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: item.name, authorId: item.id } })}
  //     style={{
  //       width: '30%',
  //       left: index % 3 === 0 ? 0 : index % 3 === 1 ? '5%' : '10%',
  //     }}
  //   >
  //     <Image
  //       source={{
  //         uri: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=128&background=4F46E5&color=fff`
  //       }}
  //       className="w-28 h-32 rounded-3xl mb-2"
  //       resizeMode="cover"
  //     />
  //     <AppText language='mm' className="w-3/4 text-xs text-center line-clamp-3">
  //       {item.name}
  //     </AppText>
  //   </TouchableOpacity>
  // );

  return (
    <ScreenWrapper
      header={!hideHeader && <Header title={"Author"} onBackPress={appNavigation.goBack} />}
      isShowLoadingModal={isLoading} hidePaddingBottom={hideHeader}
    >
      <View className="pt-4 px-6">
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          // contentContainerStyle={{
          //   paddingHorizontal: 20,
          //   paddingTop: 10,
          //   paddingBottom: hasNextPage ? 80 : 16,
          //   gap: 12,
          // }}
          data={authors}
          // numColumns={3}
          keyExtractor={item => item.id.toString()}
          renderItem={renderAuthorCard}
          // renderItem={({ item }) => renderPostCard(item)}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !hasNextPage && !isLoading}
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
    </ScreenWrapper>
  );
};

export default AuthorListsScreen;
