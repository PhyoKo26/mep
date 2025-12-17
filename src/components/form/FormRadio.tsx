import AppText from 'components/text/AppText';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from 'utils/helpers';

interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioProps {
  name?: string;
  label?: string;
  className?: string;
  options: RadioOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  layout?: 'row' | 'column';
  containerClassName?: string;
  optionClassName?: string;
  labelClassName?: string;
  type?: 'default' | 'login';
}

const FormRadio: React.FC<FormRadioProps> = ({
  name,
  label,
  className,
  options,
  selectedValue,
  onValueChange,
  layout = 'column',
  containerClassName = '',
  optionClassName = '',
  labelClassName = '',
  type = 'default',
}) => {
  return (
    <View className={cn('gap-2', className)}>
      {label && <AppText className={cn(type === 'login' ? 'text-black' : 'text-gray-500', 'min-h-7')}>{label}</AppText>}
      <View
        className={`${layout === 'row' ? 'flex-row flex-wrap' : 'flex-col'} ${containerClassName}`}
      >
        {options.map((opt) => {
          const isSelected = opt.value === selectedValue;

          return (
            <TouchableOpacity
              key={opt.value}
              className={`${optionClassName} flex-row items-center ${layout === 'row' ? 'mr-6' : ''
                }`}
              onPress={() => onValueChange(opt.value)}
              activeOpacity={0.7}
            >
              <View
                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-black' : 'border-gray-400'
                  }`}
              >
                {isSelected && <View className="h-3 w-3 rounded-full bg-black" />}
              </View>
              <AppText
                weight='medium'
                className={`ml-3 ${isSelected ? 'text-black' : 'text-gray-500'} ${labelClassName}`}
              >
                {opt.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default FormRadio;
