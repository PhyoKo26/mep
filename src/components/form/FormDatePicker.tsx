import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import AppText from 'components/text/AppText';
import ErrorText from 'components/text/ErrorText';
import {
  bgInput,
  bgInputColorCode,
  borderColor,
  borderColorCode,
  errorBorderColor,
  placeholderColor,
} from 'styles/colors';
import { cn } from 'utils/helpers';
import { CalendarActiveIcon } from 'assets/svg';

interface FormDatePickerProps {
  name: string;
  label?: string;
  className?: string;
  placeholder?: string; // Added placeholder prop
  rules?: object;
  mode?: 'date' | 'time';
  type?: 'default' | 'login';
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  placeholder = 'Select a date/ time', // Default placeholder text
  rules,
  className,
  mode = 'date',
  type = 'default',
  ...rest
}) => {
  const { control, formState } = useFormContext();
  const error = formState.errors[name];
  const [open, setOpen] = useState(false);

  return (
    <View className={cn('gap-2', className)}>
      {/* Label for the date picker */}
      {label && <AppText className={cn(type === 'login' ? 'text-black' : 'text-gray-500', 'min-h-7')}>{label}</AppText>}

      {/* Date Picker with placeholder */}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              className={cn(
                'px-3 rounded-lg leading-5 text-left border justify-center',
                type === 'login' ? bgInput : 'bg-white',
                error ? errorBorderColor : borderColor,
                'min-h-14'
              )}
              onPress={() => setOpen(true)}
            >
              <View className="flex-row items-center justify-between">
                <AppText className={value ? 'text-black' : placeholderColor}>
                  {value
                    ? mode == 'date'
                      ? new Date(value).toLocaleDateString()
                      : new Date(value).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : placeholder}{' '}
                  {/* Show placeholder when no value */}
                </AppText>
                <CalendarActiveIcon width={24} height={24} />
              </View>
            </TouchableOpacity>

            {/* DatePicker Modal */}
            <DatePicker
              modal
              maximumDate={new Date()}
              open={open}
              date={value ? new Date(value) : new Date()}
              mode={mode}
              onConfirm={(selectedDate) => {
                setOpen(false);
                onChange(selectedDate);
              }}
              onCancel={() => setOpen(false)}
              {...rest}
            />
          </>
        )}
      />

      {/* Error Message */}
      {error && <ErrorText text={error.message as string} />}
    </View>
  );
};

export default FormDatePicker;
