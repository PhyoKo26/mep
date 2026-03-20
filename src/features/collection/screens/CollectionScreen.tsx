import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { ScreenWrapper, Header, AppText } from 'components';
import bookData from 'features/home/data/bookData';
import { Book } from 'features/book/types';
import { useAppNavigate } from 'hooks';
import { useGetMyCollections } from '../hooks/useCollection';
import queryClient from 'utils/queryClient';

const MyCollectionScreen = () => {
  const { appNavigation } = useAppNavigate();
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');

  const pageLimit = 10;
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetMyCollections({ limit: pageLimit });

  const myApproved = data?.pages.flatMap(page => page.data.approved) ?? [];
  const myPending = data?.pages.flatMap(page => page.data.pending) ?? [];

  // console.log('useGetMyCollections', myApproved, myPending);

  const onRefresh = () => {
    // if (!deviceInfo.udid) return;
    queryClient.removeQueries({
      queryKey: ['my-collections'],
      // exact: true,
    });
    refetch();
  };

  const loadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  let filtered: any = [];
  if (activeTab == 'approved') {
    filtered = myApproved;
  } else {
    filtered = myPending;
  }

  const renderItem = ({ item }: { item: Book }) => {
    const progressPercent = Number((Math.random()).toFixed(2));

    return (
      <TouchableOpacity
        className="flex-row p-4 bg-white rounded-2xl mb-3 shadow-sm"
        onPress={() => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: item.id } })}
      >
        {/* Left image */}
        <Image
          source={{ uri: item.cover_image }}
          className="w-[70px] h-[100px] rounded-lg bg-gray-200"
          resizeMode="cover"
        />

        {/* Right content */}
        <View className="flex-1 ml-3 justify-center">
          <AppText weight="medium" language='mm' className="text-base mb-1">
            {item.title}
          </AppText>
          <AppText className="text-sm text-gray-600 mb-3">
            {item.author.name}
          </AppText>

          {/* Progress row */}
          {/* <View className="flex-row justify-between items-center">
            <View className="w-4/5 h-[6px] bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-secondary rounded-full"
                style={{ width: `${progressPercent * 100}%` }}
              />
            </View>
            <AppText className="text-xs font-medium">
              {progressPercent * 100 == 100 ? 'Done' : Number(progressPercent * 100).toFixed(0) + '%'}
            </AppText>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      header={<Header title="My Collection" showBackButton={false} />}
      isScrollable={false}
      isShowLoadingModal={isLoading}
    >
      <View className="flex-1 px-4 pt-4">
        {/* Tabs at top-left - Fixed Tailwind */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab('approved')}
            className="px-4 py-3 mr-6"
          >
            <AppText
              weight={activeTab === 'approved' ? 'semibold' : 'normal'}
              className={`text-lg pb-1 ${activeTab === 'approved'
                ? 'border-b-4 border-[#3847BB]'
                : 'text-gray-500'
                }`}
            >
              Approved
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('pending')}
            className="py-3"
          >
            <AppText
              weight={activeTab === 'pending' ? 'semibold' : 'normal'}
              className={`text-lg pb-1 ${activeTab === 'pending'
                ? 'border-b-4 border-[#3847BB]'
                : 'text-gray-500'
                }`}
            >
              Pending
            </AppText>
          </TouchableOpacity>
        </View>

        {/* List */}
        {/* <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        /> */}
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
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

export default MyCollectionScreen;
