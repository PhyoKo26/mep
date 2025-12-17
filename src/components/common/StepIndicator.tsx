import AppText from 'components/text/AppText';
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const STEP_COUNT = 5;
const LINE_WIDTH = (width * 0.8) / STEP_COUNT; // Dynamic segment width

const STEP_COLORS = [
  {
    colors: ['#FF607F', '#FF8CA2'],
  },
  {
    colors: ['#FF879E', '#FF879F'],
  },
  {
    colors: ['#FF879F', '#FFB7C6'],
  },
  {
    colors: ['#FFB4C3', '#FFB4C3'],
  },
  {
    colors: ['#FFB4C3', '#FFB4C3'],
  },
];

const StepIndicator = ({ currentStep, onPressStep }: { currentStep: number; onPressStep?: (step: number) => void }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(currentStep - 1, { duration: 100 });
  }, [currentStep]);

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        {STEP_COLORS.map((step, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: progress.value >= index ? 1 : 0.3,
          }));

          return (
            <TouchableOpacity key={index} className="gap-2" onPress={() => onPressStep?.(index + 1)}>
              <AppText weight="medium" className="text-gray-500">{`STEP ${index + 1}`}</AppText>
              <Animated.View key={index} style={[styles.stepLine, animatedStyle]}>
                <LinearGradient
                  colors={currentStep > index ? step.colors : ['#D1D1D1', '#D1D1D1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientLine}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLine: {
    width: LINE_WIDTH,
    height: 4,
    backgroundColor: 'transparent',
  },
  gradientLine: {
    height: 6,
    borderRadius: 6,
  },
});

export default StepIndicator;
