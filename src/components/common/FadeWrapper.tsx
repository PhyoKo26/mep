import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface FadeWrapperProps {
  children: React.ReactNode;
  duration?: number; // Custom duration for fade
  delay?: number; // Optional delay for staggering
  style?: any; // Optional additional style
}

const FadeWrapper: React.FC<FadeWrapperProps> = ({
  children,
  duration = 3000,
  delay = 0,
  style,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.exp),
      });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};

export default FadeWrapper;
