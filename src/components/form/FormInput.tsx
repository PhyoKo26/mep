import React, { memo } from 'react';
import { View, TextInput, TextInputProps, Platform } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import AppText from 'components/text/AppText';
import ErrorText from 'components/text/ErrorText';
import { cn } from 'utils/helpers';
import { bgInput, borderColor, errorBorderColor, placeholderColorCode } from 'styles/colors';

interface FormInputProps extends TextInputProps {
  name: string;
  label?: string;
  rules?: object;
  className?: string; // Tailwind classes for container
  multiline?: boolean; // Enable multiline support
  numberOfLines?: number; // Number of lines for multiline input
  type?: 'default' | 'login';
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  rules,
  className = '',
  multiline = false,
  numberOfLines = 1,
  type = 'default',
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <View className={cn('gap-2', className)}>
      {label && <AppText className={cn(type === 'login' ? 'text-black' : 'text-gray-500', 'min-h-7')}>{label}</AppText>}
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
              multiline ? 'min-h-32' : 'min-h-14'
            )}
            style={{ fontFamily: 'Poppins-Regular', paddingBottom: Platform.OS === 'ios' ? undefined : 5 }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
            numberOfLines={numberOfLines}
            placeholderTextColor={placeholderColorCode}
            textAlignVertical={multiline ? 'top' : 'auto'}
            {...rest}
          />
        )}
      />
      {error && <ErrorText text={error.message as string} />}
    </View>
  );
};

export default memo(FormInput);
