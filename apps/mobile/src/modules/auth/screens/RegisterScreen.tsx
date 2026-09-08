import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SDUITextInput from '../../../components/inputs/SDUITextInput';
import Theme from '../../../app/theme';
import ApiClient from '../../../core/api/client';
import useAuthStore from '../../../core/auth/store';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await ApiClient.post('/auth/register', { email, password });
      const { accessToken, refreshToken, user } = res.data;
      
      await setSession(user, accessToken, refreshToken);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error registering new account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CREATE ACCOUNT</Text>
      <Text style={styles.subtitle}>Join the platform and launch your career acceleration path.</Text>

      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

      <SDUITextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        isRequired
      />

      <SDUITextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        isRequired
      />

      <SDUITextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repeat password"
        isRequired
      />

      <TouchableOpacity
        style={[styles.btn, isLoading ? styles.btnDisabled : null]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.btnText}>{isLoading ? 'Creating account...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNavigateToLogin} style={styles.linkContainer}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkAccent}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  logo: {
    color: Theme.colors.primary,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  errorBanner: {
    color: Theme.colors.error,
    backgroundColor: 'rgba(255, 56, 56, 0.1)',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: Theme.colors.textMain,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: Theme.spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
  },
  linkAccent: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
