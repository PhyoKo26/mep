import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';

interface DynamicCardPropsType {
  children: React.ReactNode;
  backgroundColor?: string;
  borderRadius?: number;
  elevation?: number;
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  margin?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const DynamicCard: React.FC<DynamicCardPropsType> = ({
  children,
  backgroundColor = '#fff',
  borderRadius = 22,
  elevation = 1,
  shadowColor = '#0167B2',
  style,
  padding = 20,
  margin,
  width,
  height,
  className,
}) => {
  return (
    <View
      className={className}
      style={[
        styles.card,
        {
          backgroundColor,
          borderRadius,
          // elevation,
          shadowColor,
          padding,
          margin,
          width,
          height,
        } as Object,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default DynamicCard;
