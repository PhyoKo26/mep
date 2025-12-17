import React, { memo, useCallback } from 'react';

import Modal from 'react-native-modal';
import { useTranslation } from 'hooks';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

type BottomSheetModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const BottomSheetModal = ({ isVisible, onClose, children }: BottomSheetModalProps) => {
  const t = useTranslation();

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      onBackdropPress={handleCancel}
      backdropOpacity={0.5}
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriverForBackdrop
      style={styles.modal}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} className="absolute top-5 right-5 z-50">
          <X size={24} color="gray" />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: '85%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
});

export default memo(BottomSheetModal);
