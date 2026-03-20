import React, { memo, useState } from 'react';
import { View, TextInput, TextInputProps, Platform } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import AppText from 'components/text/AppText';
import ErrorText from 'components/text/ErrorText';
import { cn } from 'utils/helpers';
import { bgInput, borderColor, errorBorderColor, placeholderColorCode } from 'styles/colors';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';

interface FormInputProps extends TextInputProps {
  name: string;
  label?: string;
  rules?: object;
  className?: string;
  multiline?: boolean;
  numberOfLines?: number;
  type?: 'default' | 'login' | 'password';
  showPasswordIcon?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  rules,
  className = '',
  multiline = false,
  numberOfLines = 1,
  type = 'default',
  showPasswordIcon = false,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={cn('gap-2', className)}>
      {label && (
        <AppText className={cn(
          type === 'login' ? 'text-black' : 'text-gray-500',
          'min-h-7'
        )}>
          {label}
        </AppText>
      )}

      <View className={showPasswordIcon ? 'relative' : ''}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={cn(
                'px-3 rounded-lg text-left border justify-center',
                type === 'login' ? bgInput : 'bg-white',
                error ? errorBorderColor : borderColor,
                multiline ? 'min-h-32' : 'min-h-14',
                showPasswordIcon ? 'pr-12' : '' // Space for icon
              )}
              style={{
                fontFamily: 'Poppins-Regular',
                paddingBottom: Platform.OS === 'ios' ? undefined : 5
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={showPasswordIcon && !showPassword}
              multiline={multiline}
              numberOfLines={numberOfLines}
              placeholderTextColor={placeholderColorCode}
              textAlignVertical={multiline ? 'top' : 'auto'}
              {...rest}
            />
          )}
        />

        {/* Lucide Password Toggle */}
        {showPasswordIcon && (
          <View
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
            pointerEvents="box-none"
          >
            {showPassword ? (
              <EyeIcon
                size={20}
                color="#6B7280"
                onPress={() => setShowPassword(false)}
              />
            ) : (
              <EyeOffIcon
                size={20}
                color="#6B7280"
                onPress={() => setShowPassword(true)}
              />
            )}
          </View>
        )}
      </View>

      {error && <ErrorText text={error.message as string} />}
    </View>
  );
};

export default memo(FormInput);
