import React, { memo, useRef } from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingModal = ({ visible = true }: { visible?: boolean }) => {
  const animationRef = useRef<LottieView>(null);
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <LottieView
            ref={animationRef}
            source={require('assets/lotties/loading.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  loaderContainer: {
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

export default memo(LoadingModal);
