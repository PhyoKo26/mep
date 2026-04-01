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
import { decryptPdfPassword, usePdfManager } from 'utils/helpers';
import { useAuthStore } from 'store';
import RNFS from 'react-native-fs';

const { width: WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const BookDetailScreen = () => {
  const { appNavigation } = useAppNavigate();
  const route = useRoute();
  const bookID = route.params?.id;
  // const BOOK: Book | any = bookData.find(({ id }) => id == bookID);
  const { token } = useAuthStore();

  const { mutate: handleGetBookDetail, data: dataDetail, isPending: isDetailPending, isSuccess } = useGetBookDetail();
  const { mutate: handleGetAllBookRelated, data: dataRelated, isPending: isRelatedPending } = useGetAllBookRelated();
  const isAnyPending = isDetailPending || isRelatedPending;

  const BOOK: Book = dataDetail?.data;
  const relatedBooks = dataRelated?.data;

  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncatedDesc = showFullDescription
    ? BOOK?.description
    : BOOK?.description?.split('\n').slice(0, 2).join('\n') + '...';

  // const BookPwd = decryptPdfPassword(BOOK?.pwd);
  // console.log('📤 SEND THIS TO BACKEND:', BookPwd);

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
  const [progress, setProgress] = useState(0);

  // const checkPdfStatus = useCallback(async () => {
  //   if (BOOK?.id) {
  //     checkPdfReady(BOOK?.id)
  //   }
  // }, [BOOK?.id, isPdfDownloaded, progress]);

  // const getExpectedSize = async (url: string): Promise<number> => {
  //   try {
  //     const response = await fetch(url, { method: 'HEAD' });
  //     return parseInt(response.headers.get('content-length') || '0', 10);
  //   } catch {
  //     return 0;  // Fallback to header check only
  //   }
  // };
  // const checkPdfReady = async (bookId: number): Promise<boolean> => {
  //   const path = getPdfPath(bookId.toString());
  //   try {
  //     const expectedSize = await getExpectedSize(`${BOOK.pdf_url}&token=${token}`);
  //     console.log('Expected size:', expectedSize);

  //     // ✅ Get LOCAL file size
  //     const exists = await RNFS.exists(path);
  //     console.log(exists, path);

  //     if (!exists) return false;

  //     const stat = await RNFS.stat(path);
  //     const localSize = stat.size;  // ✅ Local file size in bytes
  //     console.log('Local file size:', localSize);


  //     if (expectedSize > 0) {
  //       if (localSize !== expectedSize) {
  //         setIsPdfReady(false)

  //       } else {
  //         setIsPdfReady(true)

  //       }
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error('checkPdfReady error:', error);
  //     return false;
  //   }
  // };

  const checkPdfStatus = useCallback(async () => {
    if (!BOOK?.id) return;

    try {
      const path = getPdfPath(BOOK.id.toString());
      const response = await fetch(`${BOOK.pdf_url}&token=${token}`, { method: 'HEAD' });
      const expectedSize = parseInt(response.headers.get('content-length') || '0', 10);

      const exists = await RNFS.exists(path);
      if (!exists) {
        setIsPdfReady(false);
        return;
      }

      const { size } = await RNFS.stat(path);
      setIsPdfReady(expectedSize === 0 || parseInt(size.toString(), 10) === expectedSize);
    } catch (err) {
      console.error('PDF check error:', err);
      setIsPdfReady(false);
    }
  }, [BOOK?.id, token]);

  const handleReadPress = async () => {
    if (!BOOK?.id || !BOOK?.pdf_url) return;

    if (!isPdfReady) {
      setIsDownloading(true);
      try {
        // ✅ Fixed: downloadPdf (not pdfManager.downloadPdf)
        const localPath = await downloadPdf(BOOK.id.toString(), BOOK.pdf_url, (progress) => {
          setProgress(progress);
        });
        setIsPdfReady(true);
        appNavigation.navigate('BookReadScreen', {
          title: BOOK.title,
          bookURL: localPath,
          password: decryptPdfPassword(BOOK?.pwd)
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
        bookURL: localPath,
        password: decryptPdfPassword(BOOK?.pwd)
      });
    }
  };

  useEffect(() => {
    checkPdfStatus();
  }, [BOOK?.id, checkPdfStatus]);  // ✅ Added checkPdfStatus to deps

  return (
    <ScreenWrapper
      header={<Header title={`Book Detail`} onBackPress={appNavigation.goBack} />}
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
              <AppText language='mm' weight='bold' className="text-xl text-primary text-center mb-2">
                {BOOK?.title}
              </AppText>
              <AppText language='mm' weight='semibold' className="text-lg text-black/50 mb-1">Author - {BOOK?.author.name}</AppText>
              <AppText language='mm' weight='bold' className="text-2xl">{BOOK?.price} Ks</AppText>
            </View>

            <View className='border-y-2 border-gray-200 py-6'>
              {BOOK?.book_status == 3 &&
                <View className="flex-row justify-between">
                  {BOOK?.sample_url &&
                    <LinearButton
                      gradientClassName="h-12"
                      onPress={() => appNavigation.navigate('BookReadScreen', {
                        title: BOOK.title,
                        sampleURL: BOOK?.sample_url,
                        password: decryptPdfPassword(BOOK?.pwd)
                      })}
                      style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
                      // isLoading={isPending}
                      // disabled={isPending}
                      colors={['#FFCC00', '#FFB800']}
                      variant='outline'
                      outlineColor='#FFCC00'
                    >
                      <AppText weight='bold' className="text-primary">
                        Read Sample
                      </AppText>
                    </LinearButton>
                  }
                  <LinearButton
                    gradientClassName="h-12"
                    onPress={() => appNavigation.navigate('BookBuyScreen', { bookDetail: BOOK })}
                    style={{ width: WIDTH / (BOOK?.sample_url ? 2.3 : 1.1), alignSelf: 'center' }}
                    // isLoading={isPending}
                    // disabled={isPending}
                    colors={['#FFCC00', '#FFB800']}
                  >
                    <AppText weight='bold' className="text-primary">
                      Buy Now
                    </AppText>
                  </LinearButton>
                </View>
              }

              {BOOK?.book_status == 2 &&
                <LinearButton
                  gradientClassName="h-24"
                  // onPress={() => appNavigation.navigate('BookBuyScreen', { bookDetail: BOOK })}
                  style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
                  // isLoading={isPending}
                  // disabled={isPending}
                  colors={['#FFCC00', '#FFB800']}
                  textClassName='text-primary'
                >
                  {`ငွေပေးချေမှု ပြုလုပ်ပြီး။\nAdmin approve ပြုလုပ်ပြီးနောက် ဖတ်ရှုနိုင်မည်။`}
                </LinearButton>
              }

              {BOOK?.book_status == 1 &&
                <View className="flex-row justify-between">
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
                    // style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
                    style={{ width: WIDTH / (BOOK?.audios?.length != 0 ? 2.3 : 1.1), alignSelf: 'center' }}
                    colors={['#FFCC00', '#FFB800']}
                    variant={BOOK?.audios?.length != 0 ? 'outline' : 'solid'}
                    outlineColor={BOOK?.audios?.length != 0 ? '#FFCC00' : '#FFF'}
                  >
                    <View className='flex-row items-center'>
                      {isPdfReady ? (
                        <BookOpenText size={30} color="#02107D" />
                      ) : (
                        !isDownloading && <Download size={30} color="#02107D" />
                      )}
                      <AppText language='mm' weight='bold' className="text-base ml-3 text-primary">
                        {isPdfReady ? 'Read Book' : isDownloading ? `${progress}% Downloading...` : 'Download'}
                      </AppText>
                    </View>
                  </LinearButton>
                  {BOOK?.audios?.length != 0 &&
                    <LinearButton
                      gradientClassName="h-12"
                      onPress={() => appNavigation.navigate('BookPlaylistScreen', { bookDetail: BOOK })}
                      style={{ width: WIDTH / 2.3, alignSelf: 'center' }}
                      // isLoading={isPending}
                      disabled={BOOK?.audios?.length == 0}
                      colors={['#FFCC00', '#FFB800']}
                    >
                      <View className='flex-row'>
                        <Headphones size={30} color="#02107D" />
                        <AppText language='mm' weight='bold' className="text-base ml-3 text-primary">Play Book</AppText>
                      </View>
                    </LinearButton>
                  }
                </View>
              }

              {isDownloading &&
                <AppText language='mm' weight='bold' className="text-lg text-center text-red-700 mt-4">
                  {`Download လုပ်နေချိန် ခေတ္တစောင့်ပေးပါ`}
                </AppText>
              }
            </View>
            {/* Description */}
            <View className='mt-6'>
              <AppText weight='semibold' className="text-lg text-primary mb-2">Book Description</AppText>
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
            <View className='px-6 py-2'>
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
    </ScreenWrapper >
  );
};

export default BookDetailScreen;
