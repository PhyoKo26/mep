import React, { memo } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface FormWrapperProps {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  extraScrollHeight?: number; // Optional extra scroll height fix
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  contentContainerStyle = {},
  wrapperStyle = {},
  extraScrollHeight = 75, // default a modest extraHeight for keyboard
}) => {
  return (
    <KeyboardAwareScrollView
      style={wrapperStyle}
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      keyboardShouldPersistTaps="always"       // Changed from "handled"
      showsVerticalScrollIndicator={false}
      extraHeight={extraScrollHeight}           // Map your prop to KeyboardAwareScrollView
      enableOnAndroid={true}                    // Enable on Android explicitly
      enableAutomaticScroll={true}              // Enable automatic scroll when keyboard shows
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default memo(FormWrapper);
