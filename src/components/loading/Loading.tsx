import React, { memo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading = () => {
  const animationRef = useRef<LottieView>(null);

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <LottieView
          ref={animationRef}
          source={require('assets/lotties/loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </View>
  );
};

export default memo(Loading);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#F1F5F9',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  lottie: {
    width: 80,
    height: 80,
  },
});
