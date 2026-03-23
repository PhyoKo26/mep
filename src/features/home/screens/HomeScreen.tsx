import React from 'react';
import { View } from 'react-native';
import { ScreenWrapper } from 'components';
import HomeHeader from '../components/HomeHeader';
import HomeBanner from '../components/HomeBanner';
import BookList from 'components/common/BookList';
import AuthorList from 'components/common/AuthorList';
import { useAppNavigate } from 'hooks';
import {
  useGetHomePromotions,
  useGetHomeAuthors,
  useGetAllBookGroups,
} from '../hooks/useHome';

const HomeScreen = () => {
  const { appNavigation } = useAppNavigate();

  // const { data: HomeData, isPending: isHomePending } = useGetHome();
  const { data: promotions, isPending: isPromoLoading } = useGetHomePromotions();
  const { data: authors, isPending: isAuthorLoading } = useGetHomeAuthors();
  const { data: groups, isPending: isGroupLoading } = useGetAllBookGroups();

  const isLoading = isPromoLoading || isAuthorLoading || isGroupLoading;

  return (
    <ScreenWrapper
      className="px-6"
      isScrollable
      header={<HomeHeader />}
      isShowLoadingModal={isLoading}
      hidePaddingBottom
    >
      <View className="gap-5 pt-4 pb-4">
        {/* Banner */}
        {promotions?.length > 0 && (
          <HomeBanner items={promotions} />
        )}

        {/* Book Groups */}
        {groups?.map((group: any) => (
          <BookList
            key={group.id}
            title={group.title}
            books={group?.books?.slice(0, 5) || []}
            onSeeAllPress={() =>
              appNavigation.navigate('BookStack', {
                screen: 'BookListsScreen',
                params: {
                  title: group.title,
                  groupId: group.id,
                },
              })
            }
            onBookPress={(book) =>
              appNavigation.navigate('BookStack', {
                screen: 'BookDetailScreen',
                params: { id: book.id },
              })
            }
          />
        ))}

        {/* Authors */}
        {authors?.length > 0 && (
          <AuthorList
            title="Authors"
            authors={authors.slice(0, 5)}
            onSeeAllPress={() =>
              appNavigation.navigate('AuthorStack')
            }
            onAuthorPress={(author) =>
              appNavigation.navigate('BookStack', {
                screen: 'BookListsScreen',
                params: {
                  title: author.name,
                  authorId: author.id,
                },
              })
            }
          />
        )}
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