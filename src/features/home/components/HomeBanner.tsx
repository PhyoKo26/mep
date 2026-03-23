import { View, StatusBar, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { memo, useRef, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from 'components';
import { ChevronLeft } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
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
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollInterval = useRef<number | null>(null);
  const isUserScrolling = useRef(false);

  // Auto-scroll interval (3 seconds per slide)
  useEffect(() => {
    if (items?.length > 1) {
      autoScrollInterval.current = setInterval(() => {
        if (!isUserScrolling.current) {
          const nextIndex = (currentIndex + 1) % items?.length;
          setCurrentIndex(nextIndex);
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }, 3000);
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentIndex, items?.length]);

  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems[0]) {
      const newIndex = viewableItems[0].index || 0;
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const handleScrollBeginDrag = () => {
    isUserScrolling.current = true;
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };

  const handleScrollEndDrag = () => {
    // Restart auto-scroll after user stops scrolling (with delay)
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 2000);
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };

  const renderItem = ({ item }: { item: BannerItem }) => {
    return (
      <View style={{ width: CARD_WIDTH }}>
        <TouchableOpacity
          activeOpacity={0.9}
          className="flex-1"
          style={{ flex: 1 }} // Ensure touchable fills the container
          onPress={() => {
            console.log('Tapped:', item.image);
            if (item.link_type === 'book') {
              appNavigation.navigate('BookStack', {
                screen: 'BookDetailScreen',
                params: { id: item.link_id }
              });
            }
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{
              width: '100%',
              aspectRatio: 16 / 9.95, // Adjust ratio as needed (16:9 banner ratio)
              borderRadius: 10,
              // backgroundColor: '#f2f2f2', // Fallback background
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderIndicator = () => (
    <View className="flex-row justify-center items-center mt-4 px-6">
      {items.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setCurrentIndex(index);
            flatListRef.current?.scrollToIndex({
              index,
              animated: true,
            });
          }}
          className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-black/40'
            }`}
        />
      ))}
    </View>
  );

  if (!items || items?.length === 0) {
    return null;
  }

  return (
    <View className="flex items-center">
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewableItemsChanged}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollEndDrag}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        // contentContainerStyle={{ paddingHorizontal: 24 }}
        pagingEnabled={false}
      />
      {renderIndicator()}
    </View>
  );
};

export default memo(HomeBanner);
