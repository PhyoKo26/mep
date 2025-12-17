import React, { PropsWithChildren } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { AppText } from 'components';
import { cn } from 'utils/helpers';
import { bgDefault, bgPrimary } from 'styles/colors';

type ButtonVariant = 'normal' | 'large';

type ButtonProps = PropsWithChildren<{
  className?: string;
  variant?: ButtonVariant;
  isDisabled?: boolean;
}> &
  TouchableOpacityProps;

const Button: React.FC<ButtonProps> = ({ className, onPress = () => {}, children, variant, isDisabled, ...props }) => {
  const isLarge = variant === 'large';

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={isDisabled}
      className={cn(
        'px-[16] py-[16]',
        !isLarge ? 'rounded-[8px]' : 'rounded-full',
        isDisabled ? bgDefault : bgPrimary,
        className
      )}
      onPress={onPress}
      {...props}
    >
      {typeof children === 'string' ? <AppText>{children}</AppText> : children}
    </TouchableOpacity>
  );
};

export default Button;
