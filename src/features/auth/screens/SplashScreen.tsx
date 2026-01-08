import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, StatusBar, TouchableOpacity, View, ImageBackground, Image } from 'react-native';
import { AppText, LinearButton, ScreenWrapper } from 'components';
import { useAppNavigate, useDeviceInfo, useTranslation } from 'hooks';
import { useAuthStore, useLanguageStore, useOnboardingStore } from 'store';
import { useAuth } from '../hooks/useAuth';
import LinearGradient from 'react-native-linear-gradient';
import { cn } from 'utils/helpers';
import Animated, { Easing, ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const logoSrc = require('../../../assets/images/logo.png');

const SplashScreen = () => {
  const t = useTranslation();
  const { appNavigation } = useAppNavigate();
  const { lang, setLanguage } = useLanguageStore();
  const { data, setStep } = useOnboardingStore();
  const { fcmToken, setIsAuthenticated, setToken } = useAuthStore();
  const deviceInfo = useDeviceInfo();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const animateOption = {
      duration: 1500,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.System,
    };

    opacity.value = withTiming(1, animateOption);
    translateY.value = withTiming(-HEIGHT / 3, animateOption, (finished) => {
      if (finished) {
        runOnJS(setShowButtons)(true);
      }
    });
  }, []);

  // Animate logo style
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    // opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Animate buttons opacity style
  useEffect(() => {
    setToken('', '');
    if (showButtons) {
      buttonsOpacity.value = withTiming(1, { duration: 500 });
    }
  }, [showButtons]);

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  const onSubmit = useCallback((type: string) => {
    if (type == 'Login') {
      appNavigation.navigate('LoginScreen');
    } else if (type == 'Register') {
      setStep(1);
      appNavigation.navigate('RegisterStack');
    }
  }, [deviceInfo, data]);

  return (
    <LinearGradient
      colors={['#3847BB', '#02107D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center' }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View
        className={cn('absolute w-screen justify-center items-center',)}
      >
        <Animated.View style={logoAnimatedStyle}>
          <Image source={logoSrc} style={{ width: WIDTH / 1.3, height: WIDTH / 4 }} resizeMode="contain" />
        </Animated.View>
      </View>
      {showButtons && (
        <Animated.View
          style={[
            { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
            buttonsAnimatedStyle,
          ]}
          className="flex px-5 gap-8 rounded-2xl p-10"
        >
          <LinearButton
            gradientClassName="h-12"
            style={{ width: WIDTH / 1.1, alignSelf: 'center', marginTop: '20%' }}
            onPress={() => onSubmit('Login')}
            // isLoading={isAnyPending}
            // disabled={isAnyPending}
            variant={'outline'}
            outlineColor={'#FFFFFF'}
          >
            {`Login with Email`}
          </LinearButton>
          <LinearButton
            gradientClassName="h-12"
            style={{ width: WIDTH / 1.1, alignSelf: 'center' }}
            onPress={() => onSubmit('Register')}
            // isLoading={isAnyPending}
            // disabled={isAnyPending}
            variant={'outline'}
            outlineColor={'#FFFFFF'}
          >
            {`Registration`}
          </LinearButton>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

export default SplashScreen;
