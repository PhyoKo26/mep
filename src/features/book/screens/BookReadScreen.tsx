import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import RNBlobUtil from 'react-native-blob-util';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';

import { AppText, Header, ScreenWrapper } from 'components';
import { useAppNavigate } from 'hooks';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

const BookReadScreen = () => {
    const { appNavigation } = useAppNavigate();
    const route = useRoute();
    const { title } = route.params || {};

    const pdfRef = useRef<any>(null);

    const [localPath, setLocalPath] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        downloadPdf();
    }, []);

    const downloadPdf = async () => {
        try {
            const { fs } = RNBlobUtil;
            const path = `${fs.dirs.CacheDir}/book.pdf`;

            const res = await RNBlobUtil.config({
                path,
                fileCache: true,
            }).fetch('GET', PDF_URL);

            setLocalPath(`file://${res.path()}`);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to download PDF');
            setLoading(false);
        }
    };
    // const downloadPdf = async () => {
    //     try {
    //         const { fs } = RNBlobUtil;
    //         const path = `${fs.dirs.DocumentDir}/book.pdf`;

    //         const exists = await fs.exists(path);
    //         if (!exists) {
    //             await RNBlobUtil.config({
    //                 path,
    //                 fileCache: true,
    //             }).fetch(
    //                 'GET',
    //                 PDF_URL
    //             );
    //         }

    //         setLocalPath(`file://${path}`);
    //     } catch (e) {
    //         console.log('PDF download error', e);
    //     }
    // };

    const goPrev = () => {
        if (page > 1) {
            pdfRef.current?.setPage(page - 1);
            setPage(p => p - 1);
        }
    };

    const goNext = () => {
        if (page < totalPages) {
            pdfRef.current?.setPage(page + 1);
            setPage(p => p + 1);
        }
    };

    return (
        <ScreenWrapper
            header={<Header title={title} onBackPress={appNavigation.goBack} />}
            isShowLoadingModal={!localPath}
        >
            <View className="flex-1 bg-white">
                {!localPath ? (
                    // <ActivityIndicator size="large" style={{ marginTop: '100%' }} />
                    <></>
                ) : (
                    <Pdf
                        ref={pdfRef}
                        source={{ uri: localPath }}
                        enablePaging
                        page={page}
                        onLoadComplete={(pages) => {
                            setTotalPages(pages);
                            setLoading(false);
                        }}
                        onPageChanged={(p) => setPage(p)}
                        onError={(e) => {
                            console.log('PDF Error:', e);
                            setLoading(false);
                        }}
                        style={{ flex: 1 }}
                    />
                )}
            </View>

            {/* Bottom Controls */}
            <View className="px-6 pb-4 pt-3 bg-white border-t border-gray-100">
                <View className="flex-row items-center justify-between">

                    {/* <View className="flex-row space-x-2"> */}
                    <TouchableOpacity
                        onPress={goPrev}
                        disabled={page <= 1}
                        className="flex-row px-4 py-1 rounded-full border w-[110] justify-between"
                    >
                        <ArrowLeft size={20} /><AppText>Previous</AppText>
                    </TouchableOpacity>
                    <AppText>
                        {page} / {totalPages}
                    </AppText>
                    <TouchableOpacity
                        onPress={goNext}
                        disabled={page >= totalPages}
                        className="flex-row px-4 py-1 rounded-full border w-[110] justify-between"
                    >
                        <AppText>Next</AppText><ArrowRight size={20} />
                    </TouchableOpacity>
                    {/* </View> */}
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default BookReadScreen;
