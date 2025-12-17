import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import HomeHeader from '../components/HomeHeader';
import { AppText, ScreenWrapper } from 'components';
import HomeBanner from '../components/HomeBanner';
import Searcher from 'components/common/Searcher';
import BookList from 'components/common/BookList';
import bookData from '../data/bookData';
import AuthorList from 'components/common/AuthorList';
import authorData from '../data/authorData';
import { useAppNavigate } from 'hooks';

const isIOS = Platform.OS === 'ios';

const HomeScreen = () => {
  const { appNavigation } = useAppNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper className='px-6' isScrollable header={<HomeHeader />} isShowLoadingModal={isLoading} hidePaddingBottom>
      <View className='gap-5 pt-4'>
        <Searcher
          onSearch={(query) => console.log('Searching:', query)}
          placeholder="Search"
        />
        <HomeBanner />
        <BookList
          title="Best Seller"
          books={bookData.slice(0, 3) as any}
          onSeeAllPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: 'Best Seller' } })}
          onBookPress={(book) => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: book.id } })}
        />
        <AuthorList
          title="Authors"
          authors={authorData as any}
          // onSeeAllPress={() => appNavigation.navigate('AuthorStack')}
          onSeeAllPress={() => appNavigation.navigate('HomeStack', { screen: 'Author' })}
          onAuthorPress={(author) => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: author.name } })}
        />
        <BookList
          title="New Releases"
          books={bookData.slice(2, 5).reverse() as any}
          onSeeAllPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: 'New Releases' } })}
          onBookPress={(book) => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: book.id } })}
        />
        {/* <View>
          <AppText weight='bold'>
            {`Home\nA place where I can go\nTo take this off my shoulders\nSomeone take me home`}
          </AppText>
        </View> */}
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
