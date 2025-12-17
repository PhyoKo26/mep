import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { X, Info } from 'lucide-react-native';
import { ToastConfig } from 'react-native-toast-message';
import { AppText } from 'components';
import Toast from 'react-native-toast-message';
import { errorColorCode, infoColorCode, successColorCode } from 'styles/colors';
import { ToastConfigParams } from 'react-native-toast-message';

interface ToastProps extends ToastConfigParams<any> {
  type: ToastConfigParams<any>['type'];
}

interface ToastTemplateProps {
  text1?: string;
  text2?: string;
  iconColor: string;
}

// Reusable ToastTemplate component
const ToastTemplate: React.FC<ToastTemplateProps> = ({ text1, text2, iconColor }) => (
  <View className="flex-row items-center bg-[#2D3438] rounded-lg mt-5 p-4 w-[95%]">
    <View className="flex-1 flex-row items-center">
      <Info fill={iconColor} size={18} />
      <View className="ml-2 justify-center">
        {text1 && <AppText className="text-white">{text1}</AppText>}
        {text2 && <AppText className="text-white text-xs">{text2}</AppText>}
      </View>
    </View>
    <TouchableOpacity className="ml-2" onPress={() => Toast.hide()}>
      <X color={iconColor} size={14} />
    </TouchableOpacity>
  </View>
);

// Utility function to create toast configurations
const createToastConfig = (iconColor: string) => (props: ToastProps) =>
  <ToastTemplate text1={props.text1} text2={props.text2} iconColor={iconColor} />;

// Toast configuration object
const toastConfig: ToastConfig = {
  default: createToastConfig('#fff'),
  info: createToastConfig(infoColorCode),
  success: createToastConfig(successColorCode),
  error: createToastConfig(errorColorCode),
  warning: createToastConfig(infoColorCode), // Reusing infoColorCode for warnings
};

export default toastConfig;
