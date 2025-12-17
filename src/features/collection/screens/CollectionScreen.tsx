import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, FlatList, Image } from 'react-native';
import { ScreenWrapper, Header, AppText } from 'components';
import bookData from 'features/home/data/bookData';
import { Book } from 'features/book/types';
import { useAppNavigate } from 'hooks';

const MyCollectionScreen = () => {
  const { appNavigation } = useAppNavigate();
  const [activeTab, setActiveTab] = useState<'book' | 'audio'>('book');

  let filtered: any = [];
  if (activeTab == 'book') {
    filtered = bookData.filter(item => item.id !== '2');
  } else {
    filtered = bookData.filter(item => item.id === '2');
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
          source={{ uri: item.image }}
          className="w-[70px] h-[100px] rounded-lg bg-gray-200"
          resizeMode="cover"
        />

        {/* Right content */}
        <View className="flex-1 ml-3 justify-center">
          <AppText weight="medium" language='mm' className="text-base mb-1">
            {item.title}
          </AppText>
          <AppText className="text-sm text-gray-600 mb-3">
            {item.author}
          </AppText>

          {/* Progress row */}
          <View className="flex-row justify-between items-center">
            <View className="w-4/5 h-[6px] bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-secondary rounded-full"
                style={{ width: `${progressPercent * 100}%` }}
              />
            </View>
            <AppText className="text-xs font-medium">
              {progressPercent * 100 == 100 ? 'Done' : Number(progressPercent * 100).toFixed(0) + '%'}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      header={<Header title="My Collection" />}
      isScrollable={false}
    >
      <View className="flex-1 px-4 pt-4">
        {/* Tabs at top-left - Fixed Tailwind */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab('book')}
            className="px-8 py-3 mr-6"
          >
            <AppText
              weight={activeTab === 'book' ? 'semibold' : 'normal'}
              className={`text-lg pb-1 ${activeTab === 'book'
                ? 'border-b-4 border-[#3847BB]'
                : 'text-gray-500'
                }`}
            >
              Book
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('audio')}
            className="py-3"
          >
            <AppText
              weight={activeTab === 'audio' ? 'semibold' : 'normal'}
              className={`text-lg pb-1 ${activeTab === 'audio'
                ? 'border-b-4 border-[#3847BB]'
                : 'text-gray-500'
                }`}
            >
              Audio
            </AppText>
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default MyCollectionScreen;
