import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CustomSliderProps {
    value: number;
    min?: number;
    max?: number;
    onValueChange: (value: number) => void;
}

const H_PADDING = 24;
const TRACK_HEIGHT = 6;
const THUMB_SIZE = 18;

const CustomSlider: React.FC<CustomSliderProps> = ({
    value,
    min = 0,
    max = 100,
    onValueChange,
}) => {
    const trackWidth = SCREEN_WIDTH - H_PADDING * 2;
    const translateX = useSharedValue(0);

    /** 🔁 Sync thumb when value updates externally */
    useEffect(() => {
        'worklet';
        const clamped = ((value - min) / (max - min)) * trackWidth;
        translateX.value = withTiming(
            Math.max(0, Math.min(trackWidth, clamped)),
            { duration: 100 }
        );
    }, [value, min, max, trackWidth]);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            'worklet';
            // Snap to current position on touch start
        })
        .onUpdate((e) => {
            'worklet';
            const x = Math.max(
                0,
                Math.min(trackWidth, translateX.value + e.translationX)
            );

            translateX.value = x;
            const newValue = (x / trackWidth) * (max - min) + min;
            runOnJS(onValueChange)(newValue);
        })
        .onEnd(() => {
            'worklet';
            // Snap to exact position
            const newValue = (translateX.value / trackWidth) * (max - min) + min;
            runOnJS(onValueChange)(newValue);
        });

    const progressStyle = useAnimatedStyle(() => ({
        width: translateX.value,
    }));

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value - THUMB_SIZE / 2 }],
    }));

    return (
        <View style={{}}>
            {/* Track Container */}
            <View
                style={{
                    height: TRACK_HEIGHT,
                    backgroundColor: '#CFCFCF',
                    borderRadius: TRACK_HEIGHT / 2,
                    overflow: 'hidden',
                }}
            >
                <Animated.View
                    style={[
                        {
                            height: TRACK_HEIGHT,
                            backgroundColor: '#3847BB',
                            borderRadius: TRACK_HEIGHT / 2,
                        },
                        progressStyle,
                    ]}
                />
            </View>

            {/* Thumb Container - Proper Positioning */}
            <View
                style={{
                    position: 'absolute',
                    top: -(THUMB_SIZE / 2) + TRACK_HEIGHT / 2,
                    left: 0,
                    right: 0,
                    height: THUMB_SIZE,
                    pointerEvents: 'none' as const, // Let GestureDetector handle touches
                }}
            >
                <GestureDetector gesture={panGesture}>
                    <Animated.View
                        style={[
                            {
                                width: THUMB_SIZE,
                                height: THUMB_SIZE,
                                borderRadius: THUMB_SIZE / 2,
                                backgroundColor: '#3847BB',
                            },
                            thumbStyle,
                        ]}
                    />
                </GestureDetector>
            </View>
        </View>
    );
};

export default CustomSlider;
