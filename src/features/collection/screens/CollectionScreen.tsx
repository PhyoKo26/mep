import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { ScreenWrapper, Header, AppText, LinearButton } from 'components';
import bookData from 'features/home/data/bookData';
import { Book } from 'features/book/types';
import { useAppNavigate } from 'hooks';
import { useGetMyCollections } from '../hooks/useCollection';
import queryClient from 'utils/queryClient';
import { decryptPdfPassword, usePdfManager } from 'utils/helpers';
import { BookOpenText } from 'lucide-react-native';
import { useAuthStore } from 'store';
import RNFS from 'react-native-fs';

const MyCollectionScreen = () => {
  const { appNavigation } = useAppNavigate();
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const { token } = useAuthStore();

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

  const filtered = useMemo(() => {
    return activeTab === 'approved' ? myApproved : myPending;
  }, [activeTab, myApproved, myPending]);

  const { isPdfDownloaded, downloadPdf, getPdfPath } = usePdfManager();
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  // const checkPdfStatus = useCallback(async (BOOK: Book) => {
  //   if (BOOK?.id) {
  //     const exists = await isPdfDownloaded(BOOK.id.toString());
  //     if (exists) {
  //       const localPath = getPdfPath(BOOK.id.toString());
  //       appNavigation.navigate('BookStack', { screen: 'BookReadScreen', params: { title: BOOK.title, bookURL: localPath } });
  //     } else {
  //       appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: BOOK.id } })
  //       // handleReadPress(BOOK);
  //     }
  //   }
  // }, [isPdfDownloaded]);

  const checkPdfStatus = useCallback(async (BOOK: Book) => {
    if (!BOOK?.id) return;

    try {
      const path = getPdfPath(BOOK.id.toString());
      const response = await fetch(`${BOOK.pdf_url}&token=${token}`, { method: 'HEAD' });
      const expectedSize = parseInt(response.headers.get('content-length') || '0', 10);

      const exists = await RNFS.exists(path);
      if (exists) {
        const { size } = await RNFS.stat(path);
        // setIsPdfReady(expectedSize === 0 || parseInt(size.toString(), 10) === expectedSize);
        if (expectedSize === 0 || parseInt(size.toString(), 10) === expectedSize) {
          const localPath = getPdfPath(BOOK.id.toString());
          appNavigation.navigate('BookStack', { screen: 'BookReadScreen', params: { title: BOOK.title, bookURL: localPath, password: decryptPdfPassword(BOOK?.pwd) } });
        } else {
          appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: BOOK.id } })
          // handleReadPress(BOOK);
        }
      } else {
        appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: BOOK.id } })
        // handleReadPress(BOOK);
      }
    } catch (err) {
      console.error('PDF check error:', err);
      setIsPdfReady(false);
    }
  }, [token]);

  const handleReadPress = async (BOOK: Book) => {
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

  const [downloadStatus, setDownloadStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeTab !== 'approved') return; // ✅ skip for pending

    let isMounted = true;

    const checkAllBooks = async () => {
      const results = await Promise.all(
        filtered.map(async (book) => {
          if (!book.id) return [null, false];

          try {
            const exists = await isPdfDownloaded(book.id.toString());
            return [book.id.toString(), exists];
          } catch {
            return [book.id.toString(), false];
          }
        })
      );

      const newStatuses: Record<string, boolean> = {};

      results.forEach(([id, status]) => {
        if (id) newStatuses[id] = status;
      });

      if (isMounted) {
        setDownloadStatus((prev) =>
          JSON.stringify(prev) === JSON.stringify(newStatuses)
            ? prev
            : newStatuses
        );
      }
    };

    if (filtered.length > 0) {
      checkAllBooks();
    }

    return () => {
      isMounted = false;
    };
  }, [filtered, activeTab]);

  const renderItem = ({ item }: { item: Book }) => {
    const progressPercent = Number((Math.random()).toFixed(2));
    const isDownloaded = downloadStatus[item.id?.toString()] || false;

    return (
      <TouchableOpacity
        className="flex-row px-4 py-6 border-b border-gray-200"
        disabled
        onPress={() => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: item.id } })}
      >
        {/* Left image */}
        <Image
          source={{ uri: item.cover_image }}
          className="w-[100px] h-[130px] rounded-lg bg-gray-200"
          resizeMode="cover"
        />

        {/* Right content */}
        <View className="flex-1 ml-3 justify-center">
          <AppText weight="medium" language='mm' className="text-base text-primary mb-1 line-clamp-2">
            {item.title}
          </AppText>
          <AppText weight="medium" className="text-sm text-gray-600 mb-3 line-clamp-1">
            {item.author.name}
          </AppText>
          <View className='flex-row'>
            {activeTab === 'approved' &&
              <LinearButton
                onPress={() => checkPdfStatus(item)}
                style={{ width: 80, minHeight: 32, height: 30, alignSelf: 'center', borderRadius: 8 }}
              >
                <AppText weight='bold' className="text-xs text-white">{isDownloaded ? 'Read' : 'Download'}</AppText>
              </LinearButton>
            }
            <LinearButton
              variant='outline'
              onPress={() => appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: item.id } })}
              style={{ width: 80, minHeight: 32, height: 30, alignSelf: 'center', borderRadius: 8, marginLeft: 10 }}
            >
              <AppText weight='bold' className="text-xs text-primary">Detail</AppText>
            </LinearButton>
          </View>

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

  const emptyBook = () => (
    <View className="flex-1 justify-center items-center pt-[30%] px-6">
      <View className="w-24 h-24 bg-blue-100 rounded-3xl items-center justify-center">
        <BookOpenText size={56} color="#6366F1" strokeWidth={2} />
      </View>

      <AppText className="text-center mt-6 text-lg font-semibold">
        No Books Found
      </AppText>

      <AppText className="text-center mt-3 text-gray-500">
        {isLoading
          ? 'Loading books...'
          : `No books available`}
      </AppText>
    </View>
  );

  return (
    <ScreenWrapper
      header={<Header title="My Collection" showBackButton={false} />}
      isScrollable={false}
      isShowLoadingModal={isLoading}
      hidePaddingBottom
    >
      <View className="flex-1 px-4">
        {/* Tabs at top-left - Fixed Tailwind */}
        <View className="flex-row bg-black/5 rounded-full my-3">
          <TouchableOpacity
            onPress={() => setActiveTab('approved')}
            className="w-1/2"
          >
            <AppText
              weight={activeTab === 'approved' ? 'semibold' : 'normal'}
              className={`text-base text-center p-2 rounded-full ${activeTab === 'approved'
                ? 'bg-primary text-white'
                : 'text-gray-500'
                }`}
            >
              My Book
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('pending')}
            className="w-1/2"
          >
            <AppText
              weight={activeTab === 'pending' ? 'semibold' : 'normal'}
              className={`text-base text-center p-2 rounded-full ${activeTab === 'pending'
                ? 'bg-primary text-white'
                : 'text-gray-500'
                }`}
            >
              Payment Pending
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
          ListEmptyComponent={emptyBook}
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
