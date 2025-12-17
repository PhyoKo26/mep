import React, { useCallback, useRef, ReactNode } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetProps } from '@gorhom/bottom-sheet';

interface ReusableBottomSheetProps extends BottomSheetProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onOpen?: () => void;
  onClose?: () => void;
}

const ReusableBottomSheet: React.FC<ReusableBottomSheetProps> = ({
  children,
  contentContainerStyle,
  onOpen,
  onClose,
  ...bottomSheetProps
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index > 0) {
        onOpen?.();
      } else if (index === 0) {
        onClose?.();
      }
    },
    [onOpen, onClose]
  );

  return (
    <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges} {...bottomSheetProps}>
      <BottomSheetView style={[styles.contentContainer, contentContainerStyle]}>{children}</BottomSheetView>
    </BottomSheet>
  );
};

export default ReusableBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 36,
    // alignItems: 'center',
  },
});
