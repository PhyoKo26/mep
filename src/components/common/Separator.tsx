import { View } from 'react-native';
import React, { memo } from 'react';

const Separator = () => {
  return <View className="h-[1px] bg-gray-100" />;
};

export default memo(Separator);
