import { AuthStackParamList } from 'features/auth/types';
import { NotificationStackParamList } from 'features/notification/types';
import { OnboardingStackParamList } from 'features/onboarding/types';
import { ProfileStackParamList } from 'features/profile/types';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: {
    screen: keyof AppStackParamList;
    params?: any;
  };
};

export type AppStackParamList = {
  OnboardingStack: undefined;
  HomeStack: undefined;
  PostStack: { id: number };
  NotificationStack: undefined;
  ProfileEditScreen: undefined;
  LanguageScreen: undefined;
  WebViewScreen: { url: string, title: string };
};

export type AppRouteParams = AuthStackParamList &
  RootStackParamList &
  AppStackParamList &
  OnboardingStackParamList &
  ProfileStackParamList &
  NotificationStackParamList;
