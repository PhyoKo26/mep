import {
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { memo, useRef, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from 'components';
import { ChevronLeft } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';


const { width: WIDTH } = Dimensions.get('window');
const CARD_WIDTH = WIDTH - 43; // Fixed card width for proper snapping


type BannerItem = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link_type: string;
  link_id: number;
  link_url: string | null;
  sort_order: number;
};


type HomeBannerProps = {
  items: BannerItem[];
};


const HomeBanner = ({ items }: HomeBannerProps) => {
  const insets = useSafeAreaInsets();
  const { appNavigation } = useAppNavigate();
  // ScrollView ref instead of FlatList
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollInterval = useRef<number | null>(null);
  const isUserScrolling = useRef(false);


  // Auto-scroll interval (3 seconds per slide)
  useEffect(() => {
    if (items?.length <= 1) return;

    autoScrollInterval.current = setInterval(() => {
      if (!isUserScrolling.current && items.length > 1) {
        const nextIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: CARD_WIDTH * nextIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    };
  }, [currentIndex, items?.length]);


  const handleViewableItemsChanged = ({ nativeEvent }: any) => {
    const offsetX = nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);

    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };


  const handleScrollBeginDrag = () => {
    isUserScrolling.current = true;
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };


  const handleScrollEndDrag = () => {
    // Restart auto-scroll after user stops scrolling
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 2000);
  };


  const renderItem = ({ item, index }: { item: BannerItem; index: number }) => {
    return (
      <TouchableOpacity
        key={item.id.toString()}
        activeOpacity={0.9}
        className="flex-1"
        style={{ flex: 1, width: CARD_WIDTH }}
        onPress={() => {
          console.log('Tapped:', item.image);
          if (item.link_type === 'book') {
            appNavigation.navigate('BookStack', {
              screen: 'BookDetailScreen',
              params: { id: item.link_id },
            });
          }
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: '100%',
            aspectRatio: 16 / 9.95, // 16:9 banner ratio
            borderRadius: 10,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };


  const renderIndicator = () => (
    <View className="flex-row justify-center items-center mt-4 px-6">
      {items.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setCurrentIndex(index);
            scrollViewRef.current?.scrollTo({
              x: CARD_WIDTH * index,
              animated: true,
            });
          }}
          className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-black/40'}`}
        />
      ))}
    </View>
  );


  if (!items || items.length === 0) {
    return null;
  }


  return (
    <View className="flex items-center">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        // contentContainerStyle={{ paddingHorizontal: 24 }}
        pagingEnabled={false}
        onScroll={handleViewableItemsChanged}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollEndDrag}
        scrollEventThrottle={16}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id.toString()}
            activeOpacity={0.9}
            className="flex-1"
            style={{ flex: 1, width: CARD_WIDTH }}
            onPress={() => {
              console.log('Tapped:', item.image);
              if (item.link_type === 'book') {
                appNavigation.navigate('BookStack', {
                  screen: 'BookDetailScreen',
                  params: { id: item.link_id },
                });
              }
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                aspectRatio: 16 / 9.95,
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderIndicator()}
    </View>
  );
};


export default memo(HomeBanner);