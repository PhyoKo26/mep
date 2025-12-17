import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from 'utils/helpers';

interface RadioButtonProps {
  label?: string;
  isSelected: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, isSelected, onPress }) => {
  // Use useCallback to memoize the onPress handler
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity onPress={handlePress} className={cn('flex-row items-center')}>
      <View className={cn('w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center')}>
        {isSelected && <View className={cn('w-3 h-3 rounded-full bg-primary')} />}
      </View>
      <Text className={cn('ml-2')}>{label}</Text>
    </TouchableOpacity>
  );
};

export default memo(RadioButton);
