import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import HomeHeader from '../components/HomeHeader';
import { AppText, ScreenWrapper } from 'components';
import HomeBanner from '../components/HomeBanner';
import Searcher from 'components/common/Searcher';
import BookList from 'components/common/BookList';
import AuthorList from 'components/common/AuthorList';
import { useAppNavigate } from 'hooks';
import { useGetAllBookGroups, useGetHome, useGetHomeAuthors, useGetHomePromotions } from '../hooks/useHome';

const isIOS = Platform.OS === 'ios';

const HomeScreen = () => {
  const { appNavigation } = useAppNavigate();

  const { data: HomeData, isPending: isHomeData } = useGetHome();
  const { data: HomePromotions, isPending: isHomePromo } = useGetHomePromotions();
  const { data: HomeAuthors, isPending: isHomeAuthors } = useGetHomeAuthors();
  const { data: BookGroups, isPending: isBookGroups } = useGetAllBookGroups();

  const isAnyPending = isHomePromo || isHomeAuthors || isBookGroups;
  console.log('HomePromotions', HomePromotions);

  return (
    <ScreenWrapper className='px-6' isScrollable header={<HomeHeader />} isShowLoadingModal={isAnyPending} hidePaddingBottom>
      {HomeData &&
        <View className='gap-5 pt-4'>
          <Searcher
            // onSearch={(query) => query && console.log('Searching:', query)}
            onSearch={(query) => query && appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: query, searchKey: query } })}
            placeholder="Search"
          />
          <HomeBanner items={HomePromotions} />
          {/* <BookList
            title="Best Seller"
            books={HomeData?.popularBooks?.slice(0, 5)}
            onSeeAllPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: 'Best Seller', books: HomeData?.popularBooks } })}
            onBookPress={(book) => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: book.id } })}
          /> */}
          {
            BookGroups.map((groups: any) => (
              <BookList
                key={groups.id}
                title={groups.title}
                books={groups?.books?.slice(0, 5)}
                onSeeAllPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: groups.title, groupId: groups.id } })}
                onBookPress={(book) => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: book.id } })}
              />
            ))
          }
          <AuthorList
            title="Authors"
            authors={HomeAuthors.slice(0, 5)}
            // onSeeAllPress={() => appNavigation.navigate('AuthorStack')}
            onSeeAllPress={() => appNavigation.navigate('HomeStack', { screen: 'Author' })}
            onAuthorPress={(author) => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: author.name, authorId: author.id } })}
          />
          {/* <BookList
            title="New Releases"
            books={HomeData?.latestBooks?.slice(0, 5)}
            onSeeAllPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: 'New Releases', books: HomeData?.latestBooks } })}
            onBookPress={(book) => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: book.id } })}
          /> */}
          {/* <View>
          <AppText weight='bold'>
            {`Home\nA place where I can go\nTo take this off my shoulders\nSomeone take me home`}
          </AppText>
        </View> */}
        </View>
      }
    </ScreenWrapper>
  );
};

export default HomeScreen;
