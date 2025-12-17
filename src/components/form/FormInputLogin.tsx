import React, { memo, useState } from 'react';
import { View, TextInput, TextInputProps, Platform, TouchableOpacity, ImageSourcePropType, Image } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import AppText from 'components/text/AppText';
import ErrorText from 'components/text/ErrorText';
import { cn } from 'utils/helpers';
import { bgInput, borderColor, errorBorderColor, placeholderColorCode } from 'styles/colors';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';

interface FormInputLoginProps extends TextInputProps {
  name: string;
  label?: string;
  rules?: object;
  className?: string;
  leftIcon?: ImageSourcePropType;
  isPassword?: boolean;
}

const FormInputLogin: React.FC<FormInputLoginProps> = ({
  name,
  label,
  rules,
  className = '',
  leftIcon,
  isPassword = false,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={cn('relative', className)}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="relative">
            {/* Floating Label */}
            {label && (
              <View className="pb-3">
                <AppText className="text text-white" weight='semibold'>{label}</AppText>
              </View>
            )}

            <View className={cn(
              'flex-row items-center border rounded-2xl',
              error ? errorBorderColor : 'border-[#fff]',
              'min-h-14'
            )}>
              {/* Left Icon with Separator */}
              {leftIcon && (
                <View className="flex-row items-center">
                  <View className="ml-6">
                    <Image
                      source={leftIcon}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className="h-8 w-px bg-[#B57EDC] mx-3" />
                </View>
              )}

              {/* Input Field */}
              <TextInput
                className={cn(
                  'flex-1 h-full pr-3 text-white',
                  Platform.OS === 'android' ? 'py-5' : 'py-0'
                )}
                style={{ fontFamily: 'Poppins-Regular', textAlign: 'center' }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={isPassword && !showPassword}
                placeholderTextColor={placeholderColorCode}
                {...rest}
              />

              {/* Password Toggle */}
              {isPassword && (
                <TouchableOpacity
                  className="mr-6"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon width={20} height={20} color="#6B7280" />
                  ) : (
                    <EyeOffIcon width={20} height={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      {error && <ErrorText text={error.message as string} className='pl-2 pt-1' />}
    </View>
  );
};

export default memo(FormInputLogin);