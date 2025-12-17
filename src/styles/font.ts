import { Platform, StyleSheet } from 'react-native';
const isIos = Platform.OS === 'ios';

export const fontStyles = StyleSheet.create({
  PoppinsFont: {
    fontFamily: isIos ? 'Poppons-Regular' : 'PoppinsRegular',
  },

  mmFont: {
    fontFamily: isIos ? 'Pyidaungsu-Regular' : 'PyidaungsuRegular',
  },

  mmBold: {
    fontFamily: isIos ? 'Pyidaungsu-Bold' : 'PyidaungsuBold',
  },

  semiBold: {
    fontFamily: isIos ? 'Poppins-SemiBold' : 'PoppinsSemiBold',
  },

  medium: {
    fontFamily: isIos ? 'Poppins-Medium' : 'PoppinsMedium',
  },

  light: {
    fontFamily: isIos ? 'Poppins-Light' : 'PoppinsLight',
  },

  bold: {
    fontFamily: isIos ? 'Poppins-Bold' : 'PoppinsBold',
  },

  center: {
    textAlign: 'center',
  },

  left: {
    textAlign: 'left',
  },

  right: {
    textAlign: 'right',
  },

  justify: {
    textAlign: 'justify',
  },

  xs: {
    fontSize: 12,
    lineHeight: 18,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 28,
  },
  xl: {
    fontSize: 20,
    lineHeight: 32,
  },
  '2xl': {
    fontSize: 24,
    lineHeight: 32,
  },
  '3xl': {
    fontSize: 30,
    lineHeight: 36,
  },

  underline: {
    textDecorationLine: 'underline',
  },
  decoNone: {
    textDecorationLine: 'none',
  },

  lineHeightHelper: { minHeight: 23, lineHeight: 30 },
});
