import React, { memo, useMemo } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from 'components/text/AppText';
import { ChevronLeft } from 'lucide-react-native';
import { cn } from 'utils/helpers';

interface HeaderProps {
  title: string;
  titleClassName?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  className?: string;
  LeftIcon?: React.ReactNode;
  statusBarStyle?: 'light-content' | 'dark-content';
  RightIcon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  titleClassName,
  onBackPress,
  showBackButton = true,
  className,
  LeftIcon,
  RightIcon,
  statusBarStyle = 'dark-content',
}) => {
  const insets = useSafeAreaInsets();

  // Ensure proper padding for Dynamic Island and other devices
  const top = Math.max(12, insets.top);

  const containerStyles = useMemo(() => cn('flex-row', className), [className]);

  return (
    <View style={{ minHeight: top + 40, alignItems: 'flex-end' }} className={containerStyles}>
      <StatusBar translucent barStyle={statusBarStyle} backgroundColor="transparent" />
      <View className="flex-row items-center px-4">
        {showBackButton && (
          <TouchableOpacity
            onPress={onBackPress}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Navigates to the previous screen"
          >
            {LeftIcon || <ChevronLeft size={28} color="black" />}
          </TouchableOpacity>
        )}
        <AppText
          numberOfLines={1}
          weight="semibold"
          className={cn('flex-1 text-lg', titleClassName)}
          style={{ marginHorizontal: showBackButton ? 0 : 10 }}
        >
          {title}
        </AppText>
        {RightIcon && RightIcon}
      </View>
    </View>
  );
};

export default memo(Header);
