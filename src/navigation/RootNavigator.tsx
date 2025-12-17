import React, { useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';
import AuthNavigator from 'features/auth/AuthNavigator';
import AppNavigator from './AppNavigator';
import { navigationRef } from './NavigationService';
import RegistrationNavigator from 'features/register/RegistrationNavigator';
// import SplashScreen from 'react-native-splash-screen';

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator = ({ isAuthenticated }: { isAuthenticated: boolean }) => {

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{ colors: { background: '#ffffff' } } as any}
      onReady={() => {
        // SplashScreen.hide();
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <RootStack.Screen name="AuthStack" component={AuthNavigator} />
            <RootStack.Screen name="RegisterStack" component={RegistrationNavigator} />
          </>
        ) : (
          <>
            <RootStack.Screen name="AppStack" component={AppNavigator} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
