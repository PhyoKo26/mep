import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
import AppText from 'components/text/AppText';
import { redColorCode } from 'styles/colors';
import ScreenWrapper from 'components/layout/ScreenWrapper';

type NetworkErrorProps = {
  onRetry: () => void;
  openSettings: () => void;
};

const NetworkError = ({ onRetry, openSettings }: NetworkErrorProps) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        // Automatically retry when network is back
        onRetry();
      }
    });

    return () => unsubscribe();
  }, [onRetry]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LottieView
        ref={animationRef}
        source={require('assets/lotties/networkError.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <AppText weight="bold" className={'text-red-500 text-xl'}>
        Network Error
      </AppText>
      <TouchableOpacity style={styles.btn} onPress={onRetry}>
        <AppText>Retry</AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={openSettings}>
        <AppText>Open Settings</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default NetworkError;

const styles = StyleSheet.create({
  animation: {
    width: 80, // Adjust as needed
    height: 80, // Adjust as needed
  },
  btn: {
    margin: 10,
  },
});
