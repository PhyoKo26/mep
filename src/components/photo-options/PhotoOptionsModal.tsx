import React, { useRef, useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    Animated,
    Easing,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { AppText } from 'components';
import { CameraIcon, UploadIcon } from 'assets/svg';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePermission } from 'hooks';

const screenHeight = Dimensions.get('window').height;

type Props = {
    visible: boolean;
    onClose: () => void;
    onImageSelected: (base64: string, asset: Asset) => void;
};

const options = {
    mediaType: 'photo',
    includeBase64: true,
    quality: 0.8,
    maxWidth: 400,
    maxHeight: 400,
};

export const PhotoOptionsModal: React.FC<Props> = ({ visible, onClose, onImageSelected }) => {
    const { askCameraPermission, askStoragePermission } = usePermission();

    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const insets = useSafeAreaInsets();

    const [isMounted, setIsMounted] = useState(false);
    const [shouldRenderContent, setShouldRenderContent] = useState(false);

    useEffect(() => {
        if (visible) {
            setIsMounted(true);
            setShouldRenderContent(false); // hide content until positioned off-screen

            // Wait a frame, then start animation
            requestAnimationFrame(() => {
                slideAnim.setValue(screenHeight);
                setShouldRenderContent(true); // show icons only after ready
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }).start();
            });
        } else {
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 250,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                setIsMounted(false);
                setShouldRenderContent(false);
            });
        }
    }, [visible]);

    const handlePick = async (type: 'camera' | 'library') => {
        if (type === 'camera') {
            const hasCamPerm = await askCameraPermission();
            if (!hasCamPerm) return;
            launchCamera(options as any, handleResponse);
        } else {
            const hasStoragePerm = await askStoragePermission();
            if (!hasStoragePerm) return;
            launchImageLibrary(options as any, handleResponse);
        }
    };

    const handleResponse = (response: any) => {
        if (response.didCancel || response.errorCode) return;
        if (response.assets?.length) {
            const asset = response.assets[0];
            if (asset.base64 && asset.type) {
                const base64Image = `data:${asset.type};base64,${asset.base64}`;
                onImageSelected(base64Image, asset);
            }
            onClose();
        }
    };

    if (!isMounted) return null; // modal unmounted completely

    return (
        <Modal visible={isMounted} animationType="none" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <Animated.View
                style={[
                    styles.modalContainer,
                    { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom + 20 },
                ]}
            >
                {shouldRenderContent && (
                    <>
                        <TouchableOpacity
                            onPress={() => handlePick('camera')}
                            className="py-3 mb-3 mx-6 flex-row items-center"
                        >
                            <CameraIcon />
                            <AppText className="font-semibold text-lg pl-4">Take Photo</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handlePick('library')}
                            className="py-3 mx-6 flex-row items-center"
                        >
                            <UploadIcon />
                            <AppText className="font-semibold text-lg pl-4">Upload Photo</AppText>
                        </TouchableOpacity>
                    </>
                )}
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: '#00000088',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
});
