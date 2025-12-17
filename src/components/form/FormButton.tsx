import React, { memo } from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import AppText from 'components/text/AppText';
import { btnPrimary, btnPrimaryDisabled } from 'styles/colors';
import { cn } from 'utils/helpers';

type FormButtonVariant = 'normal' | 'large';

type FormButtonProps = {
  className?: string;
  variant?: FormButtonVariant;
  isDisabled?: boolean;
  isLoading?: boolean;
} & TouchableOpacityProps;

const FormButton: React.FC<FormButtonProps> = ({
  className = '',
  onPress = () => {},
  children,
  variant = 'normal',
  isDisabled = false,
  isLoading = false,
  ...props
}) => {
  const isLarge = variant === 'large';

  return (
    <TouchableOpacity activeOpacity={0.5} disabled={isDisabled || isLoading} onPress={onPress} {...props}>
      <View
        className={cn(
          'px-[16] my-1 justify-center items-center min-h-11',
          isLarge ? 'rounded-full' : 'rounded-lg',
          isDisabled ? btnPrimaryDisabled : btnPrimary,
          className
        )}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : typeof children === 'string' ? (
          <AppText>{children}</AppText>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(FormButton);
