import React, { memo } from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: WIDTH } = Dimensions.get('window');

const AuthHeader = () => {
  return (
    <LinearGradient colors={['#A8C600', '#21A300']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <Image source={require('assets/icons/auth/auth-logo.png')} style={styles.logo} resizeMode="cover" />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: WIDTH - 60,
  },
  logo: {
    width: 300,
    height: 300,
  },
});

export default memo(AuthHeader);
