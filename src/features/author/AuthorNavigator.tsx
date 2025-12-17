import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { AuthorListsStackParamList } from './types';
import AuthorListsScreen from './screens/AuthorListsScreen';
const AuthorStack = createStackNavigator<AuthorListsStackParamList>();

export default function AuthorNavigator() {
  return (
    <AuthorStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <AuthorStack.Screen name="AuthorListsScreen" component={AuthorListsScreen} />
    </AuthorStack.Navigator>
  );
}
