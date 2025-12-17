import AppText from 'components/text/AppText';
import { cn } from 'utils/helpers';
import React, { memo, useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import HapticFeedback from 'react-native-haptic-feedback';

export type TabBarItemProps = {
  text: string;
  icon: React.ReactElement;
  isActive: boolean;
  onPress: () => void;
  index: number;
};

// Animation configuration moved outside to prevent re-creation on each render
const animateOption = {
  duration: 300,
  easing: Easing.inOut(Easing.quad),
};

// Memoize icon and text to prevent unnecessary re-renders
const TabBarItem = React.memo(({ text, icon, isActive, onPress, index }: TabBarItemProps) => {
  // Shared values for opacity and scale
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Trigger animations with delay based on index
    opacity.value = withDelay(index * 50, withTiming(1, animateOption));
    scale.value = withDelay(index * 50, withTiming(1, animateOption));
  }, [index, opacity, scale]);

  // Using useAnimatedStyle for efficient animation
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const feedbackType = Platform.OS === 'ios' ? 'soft' : 'impactLight';

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          onPress();
          HapticFeedback.trigger(feedbackType, {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
        }}
        className={cn('h-[64] justify-center items-center gap-1', isActive ? '' : 'opacity-80')}
      >
        {icon}
        <AppText weight={isActive ? 'medium' : 'normal'} className={cn('text-xs', isActive ? 'text-[#3847BB]' : '')}>
          {text}
        </AppText>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default memo(TabBarItem);
