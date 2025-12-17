import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { CollectionStackParamList } from './types';
import CollectionScreen from './screens/CollectionScreen';
const CollectionStack = createStackNavigator<CollectionStackParamList>();

export default function CollectionNavigator() {
  return (
    <CollectionStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <CollectionStack.Screen name="CollectionScreen" component={CollectionScreen} />
    </CollectionStack.Navigator>
  );
}
