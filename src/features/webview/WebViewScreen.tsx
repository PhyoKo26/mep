import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header, ScreenWrapper } from 'components'; // Replace with your own header if needed
import { useRoute } from '@react-navigation/native';
import { useAppNavigate, useTranslation } from 'hooks';

const WebViewScreen = () => {
    const t = useTranslation();
    const { appNavigation } = useAppNavigate();
    const route = useRoute();
    const { url, title } = route.params as { url: string; title: string };

    return (
        <ScreenWrapper>
            {/* <Header title={title} onBackPress={appNavigation.goBack} /> */}
            <WebView source={{ uri: url }} />
        </ScreenWrapper>
    );
};

export default WebViewScreen;
