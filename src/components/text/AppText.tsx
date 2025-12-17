import { useLanguageStore } from 'store';
import React, { memo, ReactNode, useMemo } from 'react';
import { Text, TextProps, TextStyle, Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';

const isIos = Platform.OS === 'ios';

type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'italic';
type LanguageType = 'en' | 'mm';

interface AppTextProps extends TextProps {
  children: ReactNode;
  className?: string;
  weight?: FontWeight;
  language?: LanguageType; // Can be overridden manually
  style?: TextStyle;
}

const FONT_MAP: Record<LanguageType, Record<FontWeight, string>> = {
  en: {
    light: 'Poppins-Light',
    normal: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semibold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    italic: 'Poppins-Italic',
  },
  mm: {
    normal: isIos ? 'Pyidaungsu-Regular' : 'PyidaungsuRegular',
    bold: isIos ? 'Pyidaungsu-Bold' : 'PyidaungsuBold',
    light: isIos ? 'Pyidaungsu-Regular' : 'PyidaungsuRegular',
    medium: isIos ? 'Pyidaungsu-Regular' : 'PyidaungsuRegular',
    semibold: isIos ? 'Pyidaungsu-Bold' : 'PyidaungsuBold',
    italic: '',
  },
};

const AppText: React.FC<AppTextProps> = ({
  children,
  className = '',
  weight = 'normal',
  language,
  style,
  ...props
}) => {
  // Get current language from store
  const { lang } = useLanguageStore();

  // Use prop language if provided, otherwise fallback to store language
  const detectedLanguage = language || lang;

  // Get font based on language & weight
  const fontFamily = useMemo(
    () => FONT_MAP[detectedLanguage][weight] || FONT_MAP[detectedLanguage].normal,
    [detectedLanguage, weight]
  );
  const lineHeight = useMemo(() => {
    if (style?.lineHeight) {
      return style.lineHeight;
    }
    return undefined;
  }, [style?.lineHeight]);

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily,
          lineHeight,
          // backgroundColor:'red',
        },
        style,
      ]}
      className={twMerge(`text-black`, className)}
    >
      {children}
    </Text>
  );
};

export default memo(AppText);
