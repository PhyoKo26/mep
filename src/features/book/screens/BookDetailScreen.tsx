import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { AppText, Header, LinearButton, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useRoute } from '@react-navigation/native';
import bookData from 'features/home/data/bookData';
import { BookOpen, BookOpenText, ChevronRight, Headphones, Play } from 'lucide-react-native';
import { Book } from '../types';
import BookList from 'components/common/BookList';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookDetailScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const bookID = route.params?.id;
  const BOOK: Book | any = bookData.find(({ id }) => id == bookID);

  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncatedDesc = showFullDescription
    ? BOOK.descriptions
    : BOOK.descriptions.split('\n').slice(0, 2).join('\n') + '...';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper
      header={<Header title={BOOK.title} onBackPress={appNavigation.goBack} />}
      isScrollable
      isShowLoadingModal={isLoading}
    >
      {isLoading ? <></> :
        <View className="pt-4">
          <View className='px-6 pb-6'>
            <View className="items-center mb-6">
              <Image
                source={{ uri: BOOK.image }}
                style={{ width: WIDTH / 2, height: WIDTH / 1.5 }}
                className="rounded-2xl"
                resizeMode="cover"
              />
            </View>

            <View className="items-center mb-8">
              <AppText language='mm' weight='bold' className="text-xl text-center mb-2">
                {BOOK.title}
              </AppText>
              <AppText language='mm' className="mb-1">Author - {BOOK.author}</AppText>
              <AppText language='mm' weight='bold' className="text-2xl">{BOOK.price} Ks</AppText>
            </View>

            {/* Buy Now Button */}
            <LinearButton
              gradientClassName="h-12"
              onPress={() => appNavigation.navigate('BookBuyScreen', { bookDetail: BOOK })}
              style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
            // isLoading={isPending}
            // disabled={isPending}
            >
              Buy Now
            </LinearButton>

            {/* Two Action Buttons */}
            <View className="flex-row justify-between my-6">
              <LinearButton
                gradientClassName="h-12"
                onPress={() => appNavigation.navigate('BookReadScreen', { title: BOOK.title, bookURL: BOOK.pdfURL })}
                style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
              // isLoading={isPending}
              // disabled={isPending}
              >
                <View className='flex-row'>
                  <BookOpenText size={30} color="#FFFFFF" />
                  <AppText language='mm' weight='bold' className="text-base ml-3 text-white">Read Book</AppText>
                </View>
              </LinearButton>
              <LinearButton
                gradientClassName="h-12"
                onPress={() => appNavigation.navigate('BookPlayScreen', { bookDetail: BOOK })}
                style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
              // isLoading={isPending}
              // disabled={isPending}
              >
                <View className='flex-row'>
                  <Headphones size={30} color="#FFFFFF" />
                  <AppText language='mm' weight='bold' className="text-base ml-3 text-white">Play Book</AppText>
                </View>
              </LinearButton>
            </View>

            {/* Descriptions */}
            <View>
              <AppText weight='medium' className="text-lg text-gray-900 mb-2">Description</AppText>
              <AppText language='mm' className="text-sm text-gray-600 leading-5 mb-3">
                {truncatedDesc}
              </AppText>
              <TouchableOpacity
                className="items-end"
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                <AppText weight='medium' className={`text-xs text-primary underline`}>
                  {showFullDescription ? 'Read less' : 'Read more'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View className='px-6 bg-secondary/10'>
            <BookList
              title="Related Book"
              books={bookData.slice(1, 4).reverse() as any}
              onSeeAllPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: 'New Releases' } })}
              onBookPress={(book) => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: book.id } })}
            />
          </View>
        </View>
      }
    </ScreenWrapper>
  );
};

export default BookDetailScreen;
