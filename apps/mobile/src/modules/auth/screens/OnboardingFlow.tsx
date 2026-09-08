import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Theme from '../../../app/theme';
import ApiClient from '../../../core/api/client';
import useAuthStore from '../../../core/auth/store';

const loginHeaderMesh = require('../../../assets/login_header_mesh.png');

interface OnboardingFlowProps {
  onBackToWelcome: () => void;
  onNavigateToLogin: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onBackToWelcome, onNavigateToLogin }) => {
  const setSession = useAuthStore((state) => state.setSession);
  const [selectedTopics] = useState<string[]>([]);
  const [selectedReason] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId: '207362232186-95v3ip1i7stnrs3de4un18j845nlrfeq.apps.googleusercontent.com',
        offlineAccess: true,
      });
    } catch (e) {
      console.warn('Google Sign-In configuration failed', e);
    }
  }, []);

  // Registration Fields (Split first and last name to match mockup)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !email || !password) {
      setError('Please fill in all registration fields');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // 1. Submit Registration
      const res = await ApiClient.post('/auth/register', { email, password, name: fullName });
      const { accessToken, refreshToken, user } = res.data;

      // 2. Mock saving onboarding data on the backend (Profile configuration)
      try {
        await ApiClient.post('/profile/onboarding', {
          topics: selectedTopics,
          reason: selectedReason,
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      } catch (profileError) {
        console.warn('Profile onboarding sync skipped:', profileError);
      }

      await setSession(user, accessToken, refreshToken);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      try {
        await GoogleSignin.signOut();
        await GoogleSignin.revokeAccess();
      } catch (e) {}
      
      const userInfo = await GoogleSignin.signIn();
      if (userInfo && userInfo.type === 'cancelled') {
        setIsLoading(false);
        return;
      }

      const idToken = (userInfo as any).data?.idToken || (userInfo as any).idToken;
      if (!idToken) {
        throw new Error('Google Sign-In did not return an ID token.');
      }
      
      const res = await ApiClient.post('/auth/google', { idToken });
      const { accessToken, refreshToken, user } = res.data;
      await setSession(user, accessToken, refreshToken);
    } catch (e: any) {
      console.warn('Google Sign-In error:', e);
      setError(e.response?.data?.message || e.message || 'Google Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false} keyboardShouldPersistTaps="handled">
      {/* Premium Brand Mesh Gradient Header with Legibility Overlay */}
      <View style={styles.headerContainer}>
        <Image source={loginHeaderMesh} style={styles.headerMesh} resizeMode="cover" />
        <View style={styles.darkWash} />
        
        {/* Back/Exit Button */}
        <TouchableOpacity style={styles.topBackBtn} onPress={onBackToWelcome}>
          <Text style={styles.topBackText}>✕ Exit</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create an</Text>
        <Text style={styles.headerTitle}>account</Text>
      </View>

      {/* Overlay White Signup Card */}
      <View style={styles.cardContainer}>
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        {/* Google Register Button with Official G Logo */}
        <TouchableOpacity
          style={[styles.googleBtn, isLoading ? styles.disabledBtn : null]}
          onPress={handleGoogleSignup}
          disabled={isLoading}
        >
          <Image
            source={{ uri: 'https://developers.google.com/static/identity/images/g-logo.png' }}
            style={styles.googleIconImage}
          />
          <Text style={styles.googleBtnText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.orText}>or</Text>

        {/* Split Name Row (First Name | Last Name) */}
        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="First Name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Last Name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password Input with Split Eye Button */}
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setSecureText(!secureText)}
          >
            <Image
              source={{
                uri: secureText
                  ? 'https://img.icons8.com/material-outlined/24/6b7280/visible.png'
                  : 'https://img.icons8.com/material-outlined/24/6b7280/invisible.png',
              }}
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        </View>

        {/* Submit Register Button */}
        <TouchableOpacity
          style={[styles.actionBtn, isLoading ? styles.disabledBtn : null]}
          disabled={isLoading}
          onPress={handleRegister}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionBtnText}>Create account</Text>
          )}
        </TouchableOpacity>

        {/* Legal Disclaimer & Have Account Link */}
        <View style={styles.footerContainer}>
          <Text style={styles.disclaimerText}>
            Signing up for a Human Platform account means you agree to the{' '}
            <Text style={styles.underline}>Privacy Policy</Text> and{' '}
            <Text style={styles.underline}>Terms of Service</Text>.
          </Text>

          <TouchableOpacity onPress={onNavigateToLogin} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Have an account? <Text style={styles.underlineBold}>Log in here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    height: 250,
    backgroundColor: '#111827', 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  topBackBtn: {
    position: 'absolute',
    top: 16,
    left: 20,
    zIndex: 20,
    padding: 8,
  },
  topBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerMesh: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  darkWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.22)', 
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    zIndex: 10,
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -36, 
    paddingHorizontal: Theme.spacing.lg * 1.2,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xl,
  },
  errorBanner: {
    color: Theme.colors.error,
    backgroundColor: 'rgba(255, 56, 56, 0.08)',
    padding: Theme.spacing.md,
    borderRadius: 18,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 28,
    height: 56,
    width: '100%',
    marginBottom: 16,
  },
  googleIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleBtnText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  orText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  nameInput: {
    width: '48.5%',
    marginBottom: 0,
  },
  input: {
    backgroundColor: '#F3F4F6', 
    borderRadius: 18,
    height: 56,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#111827',
    marginBottom: 14,
  },
  passwordRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeBtn: {
    width: 56,
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    tintColor: '#6B7280',
  },
  actionBtn: {
    backgroundColor: '#111827',
    borderRadius: 28,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Theme.spacing.xl,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  loginLink: {
    padding: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  underlineBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default OnboardingFlow;
