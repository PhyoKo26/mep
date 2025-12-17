import AppText from 'components/text/AppText';
import { cn } from 'utils/helpers';
import React from 'react';
import { ActivityIndicator, StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LinearButtonProps extends TouchableOpacityProps {
  title?: string;
  colors?: string[];
  disabledColors?: string[];
  textClassName?: string;
  containerClassName?: string;
  gradientClassName?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline'; // NEW: outline option
  outlineColor?: string;         // NEW: outline color prop
}

const LinearButton: React.FC<LinearButtonProps> = ({
  onPress,
  colors = ['#3847BB', '#02107D'],
  disabledColors = ['#A0A0A0', '#02107D'],
  disabled,
  textClassName = '',
  containerClassName = '',
  gradientClassName = '',
  style,
  children,
  isLoading = false,
  variant = 'solid',                // Default to solid
  outlineColor = '#02107D',         // Outline color (match your gradient)
  ...props
}) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      activeOpacity={disabled ? 1 : 0.8}
      className={cn(containerClassName)}
      disabled={disabled}
      {...props}
    >
      {isOutline ? (
        <View
          style={[
            {
              minHeight: 56,
              justifyContent: 'center',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: disabled ? '#A0A0A0' : outlineColor,
              backgroundColor: 'transparent',
              opacity: disabled ? 0.6 : 1,
            },
            style,
          ]}
        >
          <View className={cn('min-h-10 items-center justify-center', gradientClassName)}>
            {isLoading ? (
              <ActivityIndicator size="small" color={disabled ? '#A0A0A0' : outlineColor} />
            ) : (
              <>
                {typeof children === 'string' ? (
                  <AppText
                    weight="bold"
                    className={cn(
                      isOutline ? 'text-center text-sm' : 'text-white text-center text-sm',
                      textClassName
                    )}
                    style={{
                      color: disabled ? '#A0A0A0' : outlineColor,
                      opacity: disabled ? 0.6 : 1,
                    }}
                  >
                    {children}
                  </AppText>
                ) : (
                  children
                )}
              </>
            )}
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={disabled ? disabledColors : colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              minHeight: 56,
              justifyContent: 'center',
              borderRadius: 16,
              opacity: disabled ? 0.6 : 1,
              shadowColor: '#02107D',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 45,
            },
            style,
          ]}
        >
          <View className={cn('min-h-10 items-center justify-center', gradientClassName)}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                {typeof children === 'string' ? (
                  <AppText
                    weight="bold"
                    className={cn('text-white text-center text-sm', textClassName)}
                    style={{ opacity: disabled ? 0.6 : 1 }}
                  >
                    {children}
                  </AppText>
                ) : (
                  children
                )}
              </>
            )}
          </View>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default LinearButton;
