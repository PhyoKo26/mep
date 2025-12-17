import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';

/**
 * Requests notification permissions from the user.
 * Handles both iOS and Android (API 33+).
 */
export const requestNotiPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                console.log('iOS Notification Authorization status:', authStatus);
            }
            return enabled;
        } else if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            const enabled = granted === PermissionsAndroid.RESULTS.GRANTED;
            console.log('Android Notification Permission:', enabled ? 'granted' : 'denied');
            return enabled;
        }
        // For Android < 13, permission is granted by default
        return true;
    } catch (error) {
        console.warn('Permission request error:', error);
        return false;
    }
};

/**
 * Retrieves the current device's FCM token.
 */
export const getFirebaseToken = async (): Promise<string | undefined> => {
    try {
        const app = getApp(); // Ensure app is initialized
        const messaging = getMessaging(app);
        const token = await getToken(messaging);
        return token;
    } catch (error) {
        console.error('Error fetching FCM token:', error);
        return undefined;
    }
};

/**
 * Displays a notification using Notifee, given a remoteMessage from Firebase.
 */
export const onDisplayNotification = async (remoteMessage: any) => {
    try {
        // Request permissions (required for iOS)
        await notifee.requestPermission();

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
            lights: true,
            lightColor: AndroidColor.WHITE,
        });

        // Display a notification
        await notifee.displayNotification({
            title: remoteMessage?.notification?.title ?? 'Notification',
            body: remoteMessage?.notification?.body ?? '',
            android: {
                channelId,
                color: '#3847BB',
                smallIcon: 'ic_launcher_round', // required small icon
                pressAction: {
                    id: 'default',
                },
                sound: 'default',
            },
            ios: {
                sound: 'default',
            },
        });
    } catch (error) {
        console.error('Error displaying notification:', error);
    }
};

/**
 * Displays a local notification using Notifee.
 * @param params Notifee displayNotification params
 */
export const showLocalNotification = async (params: Parameters<typeof notifee.displayNotification>[0]) => {
    try {
        await notifee.displayNotification(params);
    } catch (error) {
        console.error('Error showing local notification:', error);
    }
};
