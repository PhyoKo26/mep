import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import AppText from 'components/text/AppText';
import LinearButton from 'components/button/LinearButton';
import { AlertIcon } from 'assets/svg';
import { useTranslation } from 'hooks';

type ConfirmModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  cancelText?: string;
  confirmText?: string;
};

const ConfirmModal = ({ isVisible, title, cancelText, confirmText, onClose, onSubmit }: ConfirmModalProps) => {
  const t = useTranslation();

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    onSubmit();
    onClose();
  }, [onSubmit, onClose]);

  return (
    <Modal
      onBackdropPress={handleCancel}
      backdropOpacity={0.5}
      isVisible={isVisible}
      animationIn="fadeInUp"
      animationOut="fadeOut"
      useNativeDriverForBackdrop
    >
      <View className="w-[95%] bg-white p-8 rounded-3xl self-center justify-center items-center">
        <View className="w-24 h-24 bg-white shadow-sm shadow-gray-300 rounded-full absolute -top-14 justify-center items-center elevation-lg">
          <AlertIcon />
        </View>

        <View className="items-center">
          <AppText className="my-5 text-center">{title}</AppText>
          <View className="flex-row gap-8">
            <LinearButton className="flex-1" onPress={handleConfirm} style={{ minHeight: 41 }}>
              {confirmText || t.confirm}
            </LinearButton>
            <LinearButton className="flex-1" onPress={handleCancel} style={{ minHeight: 41 }}>
              {cancelText || t.cancel}
            </LinearButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(ConfirmModal);
