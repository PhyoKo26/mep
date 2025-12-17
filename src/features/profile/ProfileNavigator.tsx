import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { ProfileStackParamList } from './types';
import ProfileScreen from './screens/ProfileScreen';
const ProfileStack = createStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}
