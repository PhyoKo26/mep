import { Alert, Linking, Platform } from 'react-native';
import { request, PERMISSIONS, PermissionStatus } from 'react-native-permissions';
import { useCallback, useState } from 'react';

const isIos = Platform.OS === 'ios';

const usePermission = () => {
  const [locateStatus, setLocateStatus] = useState<PermissionStatus>();

  const goSetting = useCallback(() => {
    if (isIos) {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  const askLocationPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const permissionRequest = await request(
        isIos ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );
      setLocateStatus(permissionRequest);
      return permissionRequest;
    } catch (e) {
      if (e instanceof Error) Alert.alert('Error', e.message);
      return 'unavailable';
    }
  }, []);

  const askCameraPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const cameraPermission = await request(
        isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
      );
      return cameraPermission;
    } catch (e) {
      if (e instanceof Error) Alert.alert('Error', e.message);
      return 'unavailable';
    }
  }, []);

  const askStoragePermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      if (isIos) {
        // iOS photo library permission
        return await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      } else {
        if (Number(Platform.Version) >= 33) {
          // Android 13+ separate media permissions
          const readImages = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
          const readVideos = await request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
          return (readImages === 'granted' && readVideos === 'granted') ? 'granted' : 'denied';
        }
        // Older Android versions use storage permission
        return await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      }
    } catch (e) {
      if (e instanceof Error) Alert.alert('Error', e.message);
      return 'unavailable';
    }
  }, []);

  const askSettingForLocation = useCallback(() => {
    Alert.alert('Location Service is blocked', 'You need to enable permissions in settings', [
      { text: 'Go to Setting', onPress: () => setTimeout(goSetting, 500) },
    ]);
  }, [goSetting]);

  return {
    locateStatus,
    askLocationPermission,
    askCameraPermission,
    askStoragePermission,
    askSettingForLocation,
    goSetting,
  };
};

export default usePermission;
