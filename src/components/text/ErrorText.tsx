import { View } from 'react-native';
import React from 'react';
import AppText from './AppText';
import { twMerge } from 'tailwind-merge';

const ErrorText = ({ text, className }: { text: string, className?: string; }) => {
  return <AppText className={twMerge(`text-red-500 text-sm min-h-10`, className)}>{text}</AppText>;
};

export default ErrorText;
