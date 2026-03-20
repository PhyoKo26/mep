import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Platform, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { AppText, Header, LinearButton, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import bookData from 'features/home/data/bookData';
import { BookOpen, BookOpenText, ChevronRight, Download, Headphones, Play } from 'lucide-react-native';
import { Book } from '../types';
import BookList from 'components/common/BookList';
import { useGetAllBookRelated, useGetBookDetail } from '../hooks/useBook';
import { usePdfManager } from 'utils/helpers';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookDetailScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const bookID = route.params?.id;
  // const BOOK: Book | any = bookData.find(({ id }) => id == bookID);

  const { mutate: handleGetBookDetail, data: dataDetail, isPending: isDetailPending, isSuccess } = useGetBookDetail();
  const { mutate: handleGetAllBookRelated, data: dataRelated, isPending: isRelatedPending } = useGetAllBookRelated();
  const isAnyPending = isDetailPending || isRelatedPending;

  const BOOK: Book = dataDetail?.data;
  const relatedBooks = dataRelated?.data;

  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncatedDesc = showFullDescription
    ? BOOK?.description
    : BOOK?.description?.split('\n').slice(0, 2).join('\n') + '...';

  // useEffect(() => {
  //   handleGetBookDetail({ id: bookID });
  //   handleGetAllBookRelated({ book_id: bookID });
  // }, [bookID, handleGetBookDetail, handleGetAllBookRelated]);
  useFocusEffect(
    useCallback(() => {
      handleGetBookDetail({ id: bookID });
      handleGetAllBookRelated({ book_id: bookID });
    }, [bookID, handleGetBookDetail, handleGetAllBookRelated])
  );

  // const getRandomItems = (arr: any[], count = 3) =>
  //   [...arr].sort(() => Math.random() - 0.5).slice(0, count);

  // const randomBooks = getRandomItems(bookData, 3);
  const { isPdfDownloaded, downloadPdf, getPdfPath } = usePdfManager();
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const checkPdfStatus = useCallback(async () => {
    if (BOOK?.id) {
      const exists = await isPdfDownloaded(BOOK.id.toString());
      setIsPdfReady(exists);
    }
  }, [BOOK?.id, isPdfDownloaded]);

  const handleReadPress = async () => {
    if (!BOOK?.id || !BOOK?.pdf_url) return;

    if (!isPdfReady) {
      setIsDownloading(true);
      try {
        // ✅ Fixed: downloadPdf (not pdfManager.downloadPdf)
        const localPath = await downloadPdf(BOOK.id.toString(), BOOK.pdf_url);
        setIsPdfReady(true);
        appNavigation.navigate('BookReadScreen', {
          title: BOOK.title,
          bookURL: localPath
        });
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setIsDownloading(false);
      }
    } else {
      // ✅ Fixed: getPdfPath (not pdfManager.getPdfPath)
      const localPath = getPdfPath(BOOK.id.toString());  // Only needs bookId
      appNavigation.navigate('BookReadScreen', {
        title: BOOK.title,
        bookURL: localPath
      });
    }
  };

  useEffect(() => {
    checkPdfStatus();
  }, [BOOK?.id, checkPdfStatus]);  // ✅ Added checkPdfStatus to deps


  return (
    <ScreenWrapper
      header={<Header title={BOOK?.title} onBackPress={appNavigation.goBack} />}
      isScrollable
      isShowLoadingModal={isAnyPending}
    >
      {isAnyPending ? <></> :
        <View className="pt-4">
          <View className='px-6 pb-6'>
            <View className="items-center mb-6">
              <Image
                source={{
                  uri: BOOK?.cover_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(BOOK?.description)}&size=128&background=4F46E5&color=fff`
                }}
                style={{ width: WIDTH / 2, height: WIDTH / 1.5 }}
                className="rounded-2xl"
                resizeMode="cover"
              />
            </View>

            <View className="items-center mb-8">
              <AppText language='mm' weight='bold' className="text-xl text-center mb-2">
                {BOOK?.title}
              </AppText>
              <AppText language='mm' className="mb-1">Author - {BOOK?.author.name}</AppText>
              <AppText language='mm' weight='bold' className="text-2xl">{BOOK?.price} Ks</AppText>
            </View>

            {BOOK?.book_status == 3 &&
              <LinearButton
                gradientClassName="h-12"
                onPress={() => appNavigation.navigate('BookBuyScreen', { bookDetail: BOOK })}
                style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
              // isLoading={isPending}
              // disabled={isPending}
              >
                Buy Now
              </LinearButton>
            }

            {BOOK?.book_status == 2 &&
              <LinearButton
                gradientClassName="h-24"
                // onPress={() => appNavigation.navigate('BookBuyScreen', { bookDetail: BOOK })}
                style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
              // isLoading={isPending}
              // disabled={isPending}
              >
                {`ငွေပေးချေမှု ပြုလုပ်ပြီး။\nAdmin approve ပြုလုပ်ပြီးနောက် ဖတ်ရှုနိုင်မည်။`}
              </LinearButton>
            }

            {BOOK?.book_status == 1 &&
              <View className="flex-row justify-between my-6">
                {/* <LinearButton
                  gradientClassName="h-12"
                  onPress={() => appNavigation.navigate('BookReadScreen', { title: BOOK?.title, bookURL: BOOK?.pdf_url })}
                  style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
                // isLoading={isPending}
                // disabled={isPending}
                >
                  <View className='flex-row'>
                    <BookOpenText size={30} color="#FFFFFF" />
                    <AppText language='mm' weight='bold' className="text-base ml-3 text-white">Read Book</AppText>
                  </View>
                </LinearButton> */}
                <LinearButton
                  gradientClassName="h-12"
                  onPress={handleReadPress}
                  // isLoading={isDownloading}
                  disabled={!BOOK?.pdf_url || isDownloading}
                  style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
                >
                  <View className='flex-row items-center'>
                    {isPdfReady ? (
                      <BookOpenText size={30} color="#FFFFFF" />
                    ) : (
                      <Download size={30} color="#FFFFFF" />
                    )}
                    <AppText language='mm' weight='bold' className="text-base ml-3 text-white">
                      {isPdfReady ? 'Read Book' : isDownloading ? 'Downloading...' : 'Download & Read'}
                    </AppText>
                  </View>
                </LinearButton>
                <LinearButton
                  gradientClassName="h-12"
                  onPress={() => appNavigation.navigate('BookPlaylistScreen', { bookDetail: BOOK })}
                  style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
                  // isLoading={isPending}
                  disabled={!BOOK?.audio_urls}
                >
                  <View className='flex-row'>
                    <Headphones size={30} color="#FFFFFF" />
                    <AppText language='mm' weight='bold' className="text-base ml-3 text-white">Play Book</AppText>
                  </View>
                </LinearButton>
              </View>
            }

            {/* Description */}
            <View className='mt-6'>
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

          {relatedBooks?.length > 0 &&
            <View className='px-6 bg-secondary/10'>
              <BookList
                title="Related Book"
                books={relatedBooks}
                // onSeeAllPress={() => appNavigation.navigate('BookStack', { screen: 'BookListsScreen', params: { title: 'Related Book' } })}
                onBookPress={(book) => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: book?.id } })}
              />
            </View>
          }
        </View>
      }
    </ScreenWrapper>
  );
};

export default BookDetailScreen;
