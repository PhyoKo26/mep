import clsx, { ClassValue } from 'clsx';
import moment from 'moment';
import { Alert, Image, Linking, PixelRatio, Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { NavigationService } from 'navigation/NavigationService';
import { useAuthStore } from 'store';
import nrcData from '../nrcData';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { captureRef } from 'react-native-view-shot';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const openNetworkSettings = () => {
  const url =
    Platform.OS === 'ios'
      ? 'App-Prefs:root=WIFI' // iOS specific URL to open Wi-Fi settings
      : 'android.settings.WIFI_SETTINGS'; // Android Intent for Wi-Fi settings

  Linking.openURL(url).catch(() => {
    // Toast.show({
    //   type: 'error',
    //   text1: 'Error',
    //   text2: 'Unable to open network settings. Please try manually.',
    // });
  });
};

export const formattedDate = (date: string): string => {
  return dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '';
};

export const formatMyanmarPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.startsWith('09')) {
    return phoneNumber.replace(/^09/, '+959');
  }
  return phoneNumber;
};

export function handleNotificationData(data: any) {
  const { setToken } = useAuthStore.getState();

  if (!data || !data.type) return;

  switch (data.type) {
    case 'article':
      const articleId = data.article_id;
      if (articleId) {
        NavigationService.navigate('AppStack', {
          screen: 'PostStack',
          params: { id: Number(articleId) },
        });
      }
      break;

    case 'web':
      const link = data.link;
      if (link) {
        NavigationService.navigate('AppStack', {
          screen: 'WebViewScreen',
          params: { url: link, title: 'YRCEA' },
        });
      }
      break;

    case 'profile':
      const token = data.token;
      if (token) {
        setToken(token, 'Bareers');
        NavigationService.navigate('AppStack', {
          screen: 'HomeStack',
          params: { screen: 'Profile' },
        });
      }
      break;

    default:
      console.log('Unknown notification type:', data.type);
  }
}

export function getUniqueNrcCodes() {
  const nrcCodes = nrcData.map(item => item.nrc_code);
  const uniqueNrcCodes = [...new Set(nrcCodes)];
  return uniqueNrcCodes;
}

export function convertEngNumToMyanmar(numStr: string): string {
  const engToMmDigits: { [key: string]: string } = {
    '0': '၀',
    '1': '၁',
    '2': '၂',
    '3': '၃',
    '4': '၄',
    '5': '၅',
    '6': '၆',
    '7': '၇',
    '8': '၈',
    '9': '၉',
  };

  return numStr?.replace(/\d/g, (digit) => engToMmDigits[digit] || digit);
}

export function extractInsideParentheses(str: string | undefined): string {
  const match = str?.match(/\(([^)]+)\)/);
  return match ? match[1] : "";
}

export const showToast = (type: 'success' | 'error', text?: string) => {
  Toast.show({
    type,
    text1: type === 'success' ? text : undefined,
    text2: type === 'error' ? text : undefined,
  });
};

export async function saveImageToDevice(uri: string) {
  try {
    const imageAsset = require('assets/images/YRCEA-MMQR.jpg');
    const { uri } = Image.resolveAssetSource(imageAsset);
    const destPath = `${RNFS.TemporaryDirectoryPath}/YRCEA-MMQR.jpg`;

    let localPath = '';

    if (uri.startsWith('http')) {
      // ✅ Debug build (Metro)
      const result = await RNFS.downloadFile({
        fromUrl: uri,
        toFile: destPath,
      }).promise;

      if (result.statusCode !== 200) {
        throw new Error('Failed to download image from Metro server.');
      }

      localPath = destPath;
    } else if (Platform.OS === 'android') {
      // ✅ Android Release build (bundled asset)
      const base64 = await RNFS.readFileAssets('images/YRCEA-MMQR.jpg', 'base64');
      await RNFS.writeFile(destPath, base64, 'base64');
      localPath = destPath;
    } else {
      // ✅ iOS Release build (main bundle)
      const bundlePath = `${RNFS.MainBundlePath}/YRCEA-MMQR.jpg`;
      const base64 = await RNFS.readFile(bundlePath, 'base64');
      await RNFS.writeFile(destPath, base64, 'base64');
      localPath = destPath;
    }

    await CameraRoll.saveAsset(uri, { type: 'photo' });
    showToast('success', 'Image saved to gallery!');
  } catch (error: any) {
    console.error('❌ Save image error:', error);
    Alert.alert('❌ Failed to save image', error.message);
  }
}

export const saveCaptureRefToDevice = async (viewRef: any) => {
  if (!viewRef.current) {
    Alert.alert('Error', 'No view to capture');
    return;
  }

  // Wait for layout stabilization
  await new Promise(resolve => setTimeout(resolve as any, 300));

  // Get device pixel ratio
  const pixelRatio = PixelRatio.get();

  // Specify logical target width in pixels for capture (e.g., 360 dp)
  const logicalTargetWidth = 360;

  // Use pixelRatio to compute physical pixel width and height
  // Measure current view size in layout pixels (dp)
  const { width, height } = await new Promise<{ width: number; height: number }>(resolve => {
    viewRef.current?.measure((x: any, y: any, w: any, h: any) => {
      resolve({ width: w, height: h });
    });
  });

  // Compute scaled target dimensions (physical pixels)
  const targetWidth = Math.round(logicalTargetWidth * pixelRatio);
  const targetHeight = Math.round((targetWidth / width) * height);

  console.log(targetWidth, targetHeight);

  try {
    const uri = await captureRef(viewRef.current, {
      format: 'jpg',
      quality: 1,          // max quality
      width: targetWidth,  // physical target width scaled by pixel ratio
      height: targetHeight,// scale height preserving aspect ratio
    });

    await CameraRoll.saveAsset(uri, { type: 'photo' });
    showToast('success', 'Image saved to gallery!');
  } catch (error: any) {
    Alert.alert('Failed', error.message);
  }
};
