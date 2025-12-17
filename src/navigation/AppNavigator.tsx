import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import HomeNavigator from 'features/home/HomeNavigator';
import { useOnboardingStore } from 'store';
import WebViewScreen from 'features/webview/WebViewScreen';
import BookNavigator from 'features/book/BookNavigator';
import AuthorNavigator from 'features/author/AuthorNavigator';

const AppStack = createStackNavigator<AppStackParamList>();
const AppNavigator = () => {
  const { completeStep } = useOnboardingStore();
  return (
    <AppStack.Navigator
      initialRouteName="HomeStack"
      screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}
    >
      <AppStack.Screen name="HomeStack" component={HomeNavigator} />
      <AppStack.Screen name="BookStack" component={BookNavigator} />
      <AppStack.Screen name="AuthorStack" component={AuthorNavigator} />
      <AppStack.Screen name="WebViewScreen" component={WebViewScreen} />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
