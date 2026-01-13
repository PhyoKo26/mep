import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { BookListsStackParamList } from './types';
import BookListsScreen from './screens/BookListsScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import BookBuyScreen from './screens/BookBuyScreen';
import BookReadScreen from './screens/BookReadScreen';
import BookPlaylistScreen from './screens/BookPlaylistScreen';
import BookPlayScreen from './screens/BookPlayScreen';

const BookStack = createStackNavigator<BookListsStackParamList>();

export default function BookNavigator() {
  return (
    <BookStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <BookStack.Screen name="BookListsScreen" component={BookListsScreen} />
      <BookStack.Screen name="BookDetailScreen" component={BookDetailScreen} />
      <BookStack.Screen name="BookBuyScreen" component={BookBuyScreen} />
      <BookStack.Screen name="BookReadScreen" component={BookReadScreen} />
      <BookStack.Screen name="BookPlaylistScreen" component={BookPlaylistScreen} />
      <BookStack.Screen name="BookPlayScreen" component={BookPlayScreen} />
    </BookStack.Navigator>
  );
}
