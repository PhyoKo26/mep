import React from 'react';
import { View, TouchableOpacity, Image, Platform, Linking, Text } from 'react-native';
import { createBottomTabNavigator, TransitionPresets } from '@react-navigation/bottom-tabs';
import { HomeStackParamList } from './types';
import HomeScreen from './screens/HomeScreen';
import AuthorScreen from './../author/AuthorNavigator';
import CollectionScreen from './../collection/CollectionNavigator';
import ProfileScreen from './../profile/ProfileNavigator';
import {
  Feather,
  House,
  LibraryBig,
  UserRound,
} from 'lucide-react-native';
import { AppText } from 'components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderColor } from 'styles/colors';

const Tab = createBottomTabNavigator<HomeStackParamList>();

const tabsConfig = [
  { name: 'Home', component: HomeScreen, icon: House, label: 'Home' },
  { name: 'Author', component: AuthorScreen, icon: Feather, label: 'Author' },
  { name: 'My Collection', component: CollectionScreen, icon: LibraryBig, label: 'My Collection' },
  { name: 'Profile', component: ProfileScreen, icon: UserRound, label: 'Profile' },
];

const HomeNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#02107D',
        tabBarInactiveTintColor: '#888888',
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
        // tabBarShowLabel: true,
        tabBarStyle: {
          width: '95%',
          // height: 100,
          marginBottom: 10 + insets.bottom,
          alignSelf: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 8,
          borderColor: '#fff',
          borderRadius: 2,
          paddingTop: '2%',
        },
      }}
    >
      {tabsConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: ({ focused, color }: any) => (
              <AppText
                style={{
                  color,
                  fontSize: 12,
                  fontWeight: focused ? '600' : '400',
                  textAlign: 'center'
                }}
              >
                {tab.label}
              </AppText>
            ),
            tabBarIcon: ({ color, size, focused }: any) => {
              const IconComponent = tab.icon;
              return (
                <IconComponent
                  color={color}
                  size={size}
                  fill={focused ? '#02107D44' : 'none'}
                />
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default HomeNavigator;
