import { View, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';
import AppText from 'components/text/AppText';

const AppError = ({ message }: { message: string }) => {
  const animationRef = useRef<LottieView>(null);
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <LottieView
        ref={animationRef}
        source={require('assets/lotties/error.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <AppText>{message}</AppText>
    </View>
  );
};

export default AppError;

const styles = StyleSheet.create({
  lottie: {
    width: 120,
    height: 120,
  },
});
