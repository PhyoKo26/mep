import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { ScreenWrapper, Header, AppText, LinearButton } from 'components';
import bookData from 'features/home/data/bookData';
import { Book } from 'features/book/types';
import { useAppNavigate } from 'hooks';
import queryClient from 'utils/queryClient';
import { usePdfManager } from 'utils/helpers';
import { BookOpenText } from 'lucide-react-native';
import BookListsScreen from './BookListsScreen';
import AuthorListsScreen from 'features/author/screens/AuthorListsScreen';

const BooksTabScreen = () => {
  const { appNavigation } = useAppNavigate();
  const [activeTab, setActiveTab] = useState<'books' | 'authors'>('books');

  return (
    <ScreenWrapper
      header={<Header title="Books" showBackButton={false} />}
      isScrollable={false}
      // isShowLoadingModal={isLoading}
      hidePaddingBottom
    >
      <View className="flex-1">
        {/* Tabs at top-left - Fixed Tailwind */}
        <View className="flex-row mx-4 bg-black/5 rounded-full mt-3">
          <TouchableOpacity
            onPress={() => setActiveTab('books')}
            className="w-1/2"
          >
            <AppText
              weight={activeTab === 'books' ? 'semibold' : 'normal'}
              className={`text-base text-center p-2 rounded-full ${activeTab === 'books'
                ? 'bg-primary text-white'
                : 'text-gray-500'
                }`}
            >
              Books
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('authors')}
            className="w-1/2"
          >
            <AppText
              weight={activeTab === 'authors' ? 'semibold' : 'normal'}
              className={`text-base text-center p-2 rounded-full ${activeTab === 'authors'
                ? 'bg-primary text-white'
                : 'text-gray-500'
                }`}
            >
              Authors
            </AppText>
          </TouchableOpacity>
        </View>
        {activeTab === 'books' && <BookListsScreen hideHeader={true} />}
        {activeTab === 'authors' && <AuthorListsScreen hideHeader={true} />}
      </View>
    </ScreenWrapper>
  );
};

export default BooksTabScreen;
