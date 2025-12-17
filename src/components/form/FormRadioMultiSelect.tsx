import AppText from 'components/text/AppText';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
  selectedValues: string[]; // Array for multiple selected values
  onValueChange: (values: string[]) => void; // Emits array of selected values
  layout?: 'row' | 'column';
  containerClassName?: string;
  optionClassName?: string;
  labelClassName?: string;
  type?: 'default' | 'login';
}

const FormRadioMultiSelect: React.FC<FormRadioProps> = ({
  name,
  label,
  className,
  options,
  selectedValues,
  onValueChange,
  layout = 'column',
  containerClassName = '',
  optionClassName = '',
  labelClassName = '',
  type = 'default',
}) => {
  const toggleValue = (value: string) => {
    console.log(selectedValues);
    
    if (selectedValues.includes(value)) {
      if (selectedValues.length > 1) {
        onValueChange(selectedValues.filter((v) => v !== value));
      }
    } else {
      onValueChange([...selectedValues, value]);
    }
  };


  return (
    <View className={cn('gap-2', className)}>
      {label && (
        <AppText className={cn(type === 'login' ? 'text-black' : 'text-gray-500', 'min-h-7')}>
          {label}
        </AppText>
      )}
      <View className={`${layout === 'row' ? 'flex-row flex-wrap' : 'flex-col'} ${containerClassName}`}>
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <TouchableOpacity
              key={opt.value}
              className={`${optionClassName} flex-row items-center ${layout === 'row' ? 'mr-6' : ''}`}
              onPress={() => toggleValue(opt.value)}
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

export default FormRadioMultiSelect;
