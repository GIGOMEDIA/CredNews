import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  InvalidCredentialsException,
  NetworkException,
  UserNotFoundException,
} from 'rn-swiftauth-sdk';

import { NewsroomHeader } from '@/components/NewsroomHeader';
import { useAppAuth } from '@/hooks/useAppAuth';
import { fontFamily } from '@/utils/typography';

const friendlyError = (error: unknown): string => {
  if (
    error instanceof InvalidCredentialsException ||
    error instanceof UserNotFoundException
  ) {
    return 'Email or password is incorrect.';
  }
  if (error instanceof NetworkException) {
    return 'You appear to be offline. Reconnect and try again.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Sign in failed. Please try again.';
};

export default function SignInScreen() {
  const {
    signInWithEmail,
    sendPasswordReset,
    isLoading,
    error,
    clearError,
    isOnline,
  } = useAppAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    return () => {
      clearError?.();
    };
  }, [clearError]);

  const handleSignIn = async () => {
    setLocalError(null);
    setResetSent(false);

    if (!email.trim() || !password) {
      setLocalError('Enter your email and password.');
      return;
    }

    if (!isOnline) {
      setLocalError('You appear to be offline. Reconnect to sign in.');
      return;
    }

    try {
      await signInWithEmail({ email: email.trim(), password });
      router.back();
    } catch (signInError) {
      setLocalError(friendlyError(signInError));
    }
  };

  const handleForgotPassword = async () => {
    setLocalError(null);
    setResetSent(false);

    if (!email.trim()) {
      setLocalError('Enter your email above first, then tap forgot password.');
      return;
    }

    try {
      await sendPasswordReset(email.trim());
      setResetSent(true);
    } catch (resetError) {
      setLocalError(friendlyError(resetError));
    }
  };

  const message = localError ?? (error ? friendlyError(error) : null);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.screen}>
        <NewsroomHeader />

        <KeyboardAwareScrollView
          bottomOffset={24}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.flex}
        >
            <Pressable style={styles.backRow} onPress={() => router.back()}>
              <Feather color="#E6E6EA" name="arrow-left" size={14} />
              <Text style={styles.backLabel}>BACK</Text>
            </Pressable>

            <View style={styles.card}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>
                Welcome back. Enter your email and password to continue.
              </Text>

              {!isOnline ? (
                <View style={styles.offlineBanner}>
                  <Feather color="#F5C84B" name="wifi-off" size={11} />
                  <Text style={styles.offlineBannerText}>
                    You&apos;re offline. Sign in needs a connection.
                  </Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor="#83838D"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.field}>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect={false}
                  placeholder="Password"
                  placeholderTextColor="#83838D"
                  secureTextEntry={!isPasswordVisible}
                  style={[styles.input, styles.inputWithAdornment]}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  accessibilityLabel={
                    isPasswordVisible ? 'Hide password' : 'Show password'
                  }
                  hitSlop={8}
                  style={styles.fieldAdornment}
                  onPress={() => setIsPasswordVisible((value) => !value)}
                >
                  <Feather
                    color="#83838D"
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={16}
                  />
                </Pressable>
              </View>

              <Pressable
                style={styles.rememberRow}
                onPress={() => setRememberMe((value) => !value)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe ? (
                    <Feather color="#07090B" name="check" size={10} />
                  ) : null}
                </View>
                <Text style={styles.rememberLabel}>Remember me</Text>
              </Pressable>

              {message ? (
                <Text style={styles.errorText}>{message}</Text>
              ) : null}

              {resetSent ? (
                <Text style={styles.successText}>
                  Password reset email sent. Check your inbox.
                </Text>
              ) : null}

              <Pressable
                disabled={isLoading}
                style={[
                  styles.primaryButton,
                  isLoading && styles.primaryButtonDisabled,
                ]}
                onPress={handleSignIn}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>SIGN IN</Text>
                )}
              </Pressable>

              <View style={styles.footerLinks}>
                <Pressable hitSlop={6} onPress={handleForgotPassword}>
                  <Text style={styles.linkText}>Forgot password?</Text>
                </Pressable>
                <Pressable
                  hitSlop={6}
                  onPress={() => router.replace('/auth/signup')}
                >
                  <Text style={styles.linkText}>
                    No account?{' '}
                    <Text style={styles.linkAccent}>Sign Up</Text>
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.bottomNote}>
              <Text style={styles.bottomNoteText}>
                Browsing the feed works without an account. Sign in is required
                to comment, fact-check, and submit evidence.
              </Text>
            </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backLabel: {
    color: '#E6E6EA',
    fontFamily: fontFamily.bold,
    fontSize: 9,
  },
  backRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 12,
  },
  bottomNote: {
    marginTop: 22,
    paddingHorizontal: 4,
  },
  bottomNoteText: {
    color: '#6E6E78',
    fontFamily: fontFamily.regular,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#0D0F13',
    borderColor: '#1B1D22',
    borderWidth: 1,
    marginTop: 22,
    padding: 18,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#3A3D44',
    borderWidth: 1,
    height: 14,
    justifyContent: 'center',
    width: 14,
  },
  checkboxChecked: {
    backgroundColor: '#FF2635',
    borderColor: '#FF2635',
  },
  errorText: {
    color: '#FF8893',
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 14,
  },
  field: {
    borderBottomColor: '#FF2635',
    borderBottomWidth: 1,
    marginTop: 14,
    position: 'relative',
  },
  fieldAdornment: {
    alignItems: 'center',
    bottom: 0,
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 32,
  },
  flex: {
    flex: 1,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  input: {
    color: '#FFFFFF',
    fontFamily: fontFamily.regular,
    fontSize: 13,
    height: 38,
  },
  inputWithAdornment: {
    paddingRight: 36,
  },
  linkAccent: {
    color: '#FF2635',
    fontFamily: fontFamily.bold,
  },
  linkText: {
    color: '#A4A4AD',
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  offlineBanner: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    borderColor: 'rgba(245, 200, 75, 0.4)',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  offlineBannerText: {
    color: '#F5C84B',
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 10,
    lineHeight: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#FF2635',
    height: 42,
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  rememberLabel: {
    color: '#C8C8CF',
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  rememberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  safeArea: {
    backgroundColor: '#07090B',
    flex: 1,
  },
  screen: {
    backgroundColor: '#07090B',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 14,
  },
  subtitle: {
    color: '#A4A4AD',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  successText: {
    color: '#3BD27B',
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 14,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 32,
  },
});
