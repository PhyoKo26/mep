import { View, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';

const AppLoading = () => {
  const animationRef = useRef<LottieView>(null);
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <LottieView
        ref={animationRef}
        source={require('assets/lotties/loading.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

export default AppLoading;

const styles = StyleSheet.create({
  lottie: {
    width: 80,
    height: 80,
  },
});
