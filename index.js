/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from '~/App';
import messaging from '@react-native-firebase/messaging';
import useAuthStore from './src/store/useAuthStore';
import { onDisplayNotification } from './src/noti';

// Register background handler once globally
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     const isNotificationEnabled = useAuthStore.getState().isNotificationEnabled;

//     console.log(isNotificationEnabled, 'Remote message index:', remoteMessage);
//     if (isNotificationEnabled) {
//         await onDisplayNotification(remoteMessage);
//     }
// });

// Register the main application component
AppRegistry.registerComponent(appName, () => App);
