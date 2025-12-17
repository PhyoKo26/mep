import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RegistrationStackParamList } from './types';
import RegistrationScreen from './screens/RegistrationScreen';
const RegistrationStack = createStackNavigator<RegistrationStackParamList>();

export default function RegistrationNavigator() {
  return (
    <RegistrationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RegistrationStack.Screen name="RegistrationScreen" component={RegistrationScreen} />
    </RegistrationStack.Navigator>
  );
}
