import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { Text, TextInput } from 'react-native';

export const fontFamily = {
  thin: 'Inter_100Thin',
  extraLight: 'Inter_200ExtraLight',
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
} as const;

export const interFonts = {
  [fontFamily.thin]: Inter_100Thin,
  [fontFamily.extraLight]: Inter_200ExtraLight,
  [fontFamily.light]: Inter_300Light,
  [fontFamily.regular]: Inter_400Regular,
  [fontFamily.medium]: Inter_500Medium,
  [fontFamily.semiBold]: Inter_600SemiBold,
  [fontFamily.bold]: Inter_700Bold,
  [fontFamily.extraBold]: Inter_800ExtraBold,
  [fontFamily.black]: Inter_900Black,
};

let defaultsConfigured = false;

const applyDefaultFont = (Component: typeof Text | typeof TextInput) => {
  const componentWithDefaults = Component as typeof Component & {
    defaultProps?: {
      style?: unknown;
    };
  };

  componentWithDefaults.defaultProps = componentWithDefaults.defaultProps ?? {};
  componentWithDefaults.defaultProps.style = [
    { fontFamily: fontFamily.regular },
    componentWithDefaults.defaultProps.style,
  ];
};

export const configureGlobalFonts = () => {
  if (defaultsConfigured) {
    return;
  }

  applyDefaultFont(Text);
  applyDefaultFont(TextInput);
  defaultsConfigured = true;
};
