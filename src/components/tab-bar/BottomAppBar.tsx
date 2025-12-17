import React, { memo, useCallback } from 'react';
import { Platform, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import TabBarItem from './TabBarItem';
import { useTranslation } from 'hooks';
import shadowStyle from 'styles/shadows';
import { cn } from 'utils/helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CalendarActiveIcon,
  CalendarIcon,
  ChannelActiveIcon,
  ChannelIcon,
  HomeActiveIcon,
  HomeIcon,
  PaymentActiveIcon,
  PaymentIcon,
  ProfileActiveIcon,
  ProfileIcon,
  // SettingActiveIcon,
  // SettingIcon,
} from 'assets/svg';

interface BottomAppBarProps extends BottomTabBarProps { }

const BottomAppBar = React.memo(({ state, navigation }: any) => {
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  // Memoized callback to avoid re-creating the handlers on every render
  const handleTabPress = useCallback(
    (routeName: string, tabIndex: number) => {
      if (state.index !== tabIndex) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: routeName }],
          })
        );
      }
    },
    [state.index, navigation]
  );

  return (
    <>
      <View className='bg-secondary h-1 opacity-10' />
      <View
        className={cn('flex flex-row justify-around items-center', Platform.OS === 'android' && 'mb-0')}
        style={[shadowStyle.appBar, { bottom: insets.bottom }]}
      >
        <TabBarItem
          onPress={() => handleTabPress('Home', 0)}
          isActive={state.index === 0}
          text={t.home}
          icon={state.index === 0 ? <HomeActiveIcon /> : <HomeIcon />}
          index={0}
        />
        <TabBarItem
          onPress={() => handleTabPress('Notification', 1)}
          isActive={state.index === 1}
          text={t.notification}
          icon={state.index === 1 ? <ChannelActiveIcon /> : <ChannelIcon />}
          index={1}
        />
        <TabBarItem
          onPress={() => handleTabPress('Profile', 2)}
          isActive={state.index === 2}
          text={t.profile}
          icon={state.index === 2 ? <ProfileActiveIcon /> : <ProfileIcon />}
          index={2}
        />
        <TabBarItem
          onPress={() => handleTabPress('Payment', 3)}
          isActive={state.index === 3}
          text={t.payment}
          icon={state.index === 3 ? <PaymentActiveIcon /> : <PaymentIcon />}
          index={3}
        />
      </View>
    </>
  );
});

export default memo(BottomAppBar);
