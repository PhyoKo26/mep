import React, { useEffect } from 'react';
import '../global.css';
import './gesture-handler';
import RootNavigator from 'navigation/RootNavigator';
import { NetworkError } from 'components';
import { useNetworkStatus } from 'hooks';
import { NavigationService } from 'navigation/NavigationService';
import { handleNotificationData, openNetworkSettings } from 'utils/helpers';
// import SplashScreen from 'react-native-splash-screen';
import { useAuthStore } from 'store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import toastConfig from './config/toastConfig';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import { getFirebaseToken, onDisplayNotification, requestNotiPermission } from './noti';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const App: React.FC = () => {
  const isConnected = useNetworkStatus();
  const {
    authData,
    token,
    setToken,
    isAuthenticated,
    setIsAuthenticated,
    setFcmToken,
    isNotificationEnabled,
  } = useAuthStore();

  useEffect(() => {
    if (!authData) {
      setToken('', '');
    }
  }, [authData]);

  useEffect(() => {
    setIsAuthenticated(!!token);
    // setIsAuthenticated(true);
  }, [token]);

  if (!isConnected) {
    return <NetworkError openSettings={openNetworkSettings} onRetry={openNetworkSettings} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootNavigator isAuthenticated={isAuthenticated} />
          <Toast config={toastConfig} position="top" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
