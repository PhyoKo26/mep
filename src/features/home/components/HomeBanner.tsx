import { View, StatusBar, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { memo, useRef, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from 'components';
import { ChevronLeft } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

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
      }, 3000); // Change slide every 3 seconds
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

  const renderItem = ({ item, index }: { item: BannerItem; index: number }) => {
    // console.log(`Rendering item ${index}:`, item);

    return (
      <View style={{ width: WIDTH - 48 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          className="flex-1"
          onPress={() => {
            console.log('Tapped:', item.image);
            if (item.link_type === 'book') {
              appNavigation.navigate('BookStack', { screen: 'BookDetailScreen', params: { id: item.link_id } })
              // appNavigation.navigate('BookDetail', { id: item.link_id });
            }
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{
              width: WIDTH - 48,
              height: HEIGHT / 2.2,
              borderRadius: 10,
              // backgroundColor: '#f0f0f0',
            }}
            resizeMode="contain"
          />
          {/* <View className="mt-3 px-6 pb-4">
            <AppText className="text-primary text-lg font-bold mb-1" numberOfLines={2}>
              {item.title}
            </AppText>
            <AppText className="text-primary/80 text-sm" numberOfLines={2}>
              {item.subtitle}
            </AppText>
          </View> */}
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
    <View className="flex items-center mb-8">
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={WIDTH - 48}  // ✅ Keep this
        snapToAlignment="start"     // ✅ Changed from "center"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewableItemsChanged}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollEndDrag}
        getItemLayout={(_, index) => ({
          length: WIDTH - 48,           // ✅ Exact item width
          offset: (WIDTH - 48) * index, // ✅ Exact positioning
          index,
        })}
      // contentContainerStyle={{ paddingHorizontal: 24 }}  // ✅ Add padding
      />
      {renderIndicator()}
    </View>
  );
};

export default memo(HomeBanner);
