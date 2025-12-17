import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Dimensions, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import SoundPlayer from 'react-native-sound-player';
import { ScreenWrapper, Header, AppText } from 'components';
import { SkipBack, SkipForward, PauseCircle, PlayCircle } from 'lucide-react-native';
import { useAppNavigate } from 'hooks';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { Book } from '../types';
import { SkipBackWardIcon, SkipForWardIcon } from 'assets/svg';
import CustomSlider from 'components/common/CustomSlider';

const { width: WIDTH } = Dimensions.get('window');

const BookPlayScreen = () => {
    const isFocused = useIsFocused();
    const { appNavigation } = useAppNavigate();
    const route = useRoute();
    const { bookDetail } = route.params || {};
    const { title, image, author, audioUrl } = bookDetail as Book;

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const progressIntervalRef = useRef<any>(null);

    const mp3Url = audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

    // ✅ PROGRESS UPDATE INTERVAL - Start when playing
    useEffect(() => {
        if (isPlaying) {
            progressIntervalRef.current = setInterval(onProgressUpdate, 1000);
        } else {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        }

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isPlaying]);

    // ✅ LOAD AUDIO ONLY (no auto play)
    const loadAudio = async () => {
        try {
            setIsLoading(true);
            // Preload without playing
            await SoundPlayer.loadUrl(mp3Url);
            const info = await SoundPlayer.getInfo();
            setDuration(info.duration || 300);
            setIsLoading(false);
        } catch (error) {
            console.log('Load error:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                loadAudio();
            }, 50)
        }
        return () => {
            SoundPlayer.stop();
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isFocused]);

    const togglePlayPause = async () => {
        try {
            if (isPlaying) {
                await SoundPlayer.pause();
            } else {
                // await SoundPlayer.playUrl(mp3Url);
                await SoundPlayer.play();
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.log('Play/pause error:', error);
        }
    };

    const seekTo = async (value: number) => {
        try {
            await SoundPlayer.seek(value);
            setPosition(value);
        } catch (error) {
            console.log('Seek error:', error);
        }
    };

    const onProgressUpdate = async () => {
        try {
            const info = await SoundPlayer.getInfo();
            setPosition(info.currentTime || 0);
        } catch (error) {
            console.log('Progress error:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <ScreenWrapper isScrollable={true} isShowLoading={isLoading} header={<Header title={title} onBackPress={appNavigation.goBack} />}>
            <View className="flex-1 px-6 justify-between">
                <View className="mt-8">
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: WIDTH }}
                        className="rounded-2xl"
                        resizeMode="cover"
                    />
                    <AppText weight='medium' className="text-base mt-6">{title}</AppText>
                    <AppText weight='medium'>Author - {author}</AppText>

                    {/* ✅ Progress - Now Updates! */}
                    <View className="mt-8">
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onSlidingComplete={seekTo}
                            minimumTrackTintColor="#3847BB"
                            maximumTrackTintColor="#CFCFCF"
                            thumbTintColor="#3847BB"
                        />

                        {/* <CustomSlider
                            value={position}
                            min={0}
                            max={duration}
                            onValueChange={seekTo}  // Your seek function
                        /> */}

                        <View className="flex-row justify-between px-2">
                            <AppText className="text-sm text-gray-500">{formatTime(position)}</AppText>
                            <AppText className="text-sm text-gray-500">{formatTime(duration)}</AppText>
                        </View>
                    </View>

                    {/* Controls */}
                    <View className="items-center pt-6">
                        <View className="flex-row items-center space-x-6">
                            <TouchableOpacity
                                className="p-5"
                                onPress={() => seekTo(Math.max(0, position - 15))}
                            >
                                <SkipBackWardIcon />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="p-5 rounded-full"
                                onPress={togglePlayPause}
                            >
                                {isPlaying ? (
                                    <PauseCircle size={80} color="#3847BB" />
                                ) : (
                                    <PlayCircle size={80} color="#3847BB" />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="p-5"
                                onPress={() => seekTo(position + 15)}
                            >
                                <SkipForWardIcon />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default BookPlayScreen;
