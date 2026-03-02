import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Routes } from '../../constants/Routes';

import { getApps, initializeApp } from '@firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDSgAbBEnv6FxFD5Ypv3lssZu1w7-KRm1Y",
  authDomain: "caltrack-72fa8.firebaseapp.com",
  projectId: "caltrack-72fa8",
  storageBucket: "caltrack-72fa8.firebasestorage.app",
  messagingSenderId: "817061065777",
  appId: "1:817061065777:web:eee788a127f44deaad9110",
  measurementId: "G-LHHBVWLY99",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

function parseFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found': return 'No account found with this email';
    case 'auth/wrong-password': return 'Incorrect password';
    case 'auth/email-already-in-use': return 'An account with this email already exists';
    case 'auth/invalid-email': return 'Invalid email address';
    case 'auth/too-many-requests': return 'Too many attempts. Try again later';
    case 'auth/network-request-failed': return 'Network error. Check your connection';
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled';
    case 'auth/operation-not-allowed': return 'Guest login is not enabled. Enable Anonymous auth in Firebase Console';
    default: return 'Something went wrong. Please try again';
  }
}

export default function LoginScreen() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setGlobalError('');
  };

  const handleEmailAuth = async () => {
    clearErrors();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    if (eErr) setEmailError(eErr);
    if (pErr) setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace(Routes.TABS);
    } catch (e: any) {
      setGlobalError(parseFirebaseError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearErrors();
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace(Routes.TABS);
    } catch (e: any) {
      setGlobalError(parseFirebaseError(e.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    clearErrors();
    setGuestLoading(true);
    try {
      await signInAnonymously(auth);
      router.replace(Routes.TABS);
    } catch (e: any) {
      setGlobalError(parseFirebaseError(e.code));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="fitness" size={50} color="#00E676" />
            </View>
            <Text style={styles.brandName}>CalTrack</Text>
            <Text style={styles.tagline}>Intuitive Fitness Tracking</Text>
          </View>

          <View style={styles.welcomeTextSection}>
            <Text style={styles.mainTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.subText}>{isSignUp ? 'Sign up to get started' : 'Sign in to your account'}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <View style={[styles.inputRow, emailError ? styles.inputError : null]}>
                <Ionicons name="mail-outline" size={20} color="#8B949E" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#8B949E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                />
              </View>
              {emailError ? <Text style={styles.errorText}><Ionicons name="alert-circle-outline" size={12} /> {emailError}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <View style={[styles.inputRow, passwordError ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color="#8B949E" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8B949E"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#8B949E"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}><Ionicons name="alert-circle-outline" size={12} /> {passwordError}</Text> : null}
            </View>

            {globalError ? (
              <View style={styles.globalErrorBox}>
                <Ionicons name="warning-outline" size={16} color="#FF453A" />
                <Text style={styles.globalErrorText}>{globalError}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.btnDisabled]}
              activeOpacity={0.8}
              onPress={handleEmailAuth}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#0D1117" />
                : <Text style={styles.primaryBtnText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
              }
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
              activeOpacity={0.8}
              onPress={handleGoogleAuth}
              disabled={googleLoading}
            >
              {googleLoading
                ? <ActivityIndicator color="#FFFFFF" />
                : <>
                    <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.iconGap} />
                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                  </>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.guestBtn, guestLoading && styles.btnDisabled]}
              activeOpacity={0.8}
              onPress={handleGuestLogin}
              disabled={guestLoading}
            >
              {guestLoading
                ? <ActivityIndicator color="#8B949E" />
                : <>
                    <Ionicons name="person-outline" size={20} color="#8B949E" style={styles.iconGap} />
                    <Text style={styles.guestBtnText}>Continue as Guest</Text>
                  </>
              }
            </TouchableOpacity>

            <View style={styles.guestWarning}>
              <Ionicons name="information-circle-outline" size={14} color="#8B949E" />
              <Text style={styles.guestWarningText}>
                Guest data is not saved to an account and may be lost if you clear app data.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); clearErrors(); }}>
              <Text style={styles.linkText}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D1117',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#30363D', marginBottom: 15,
  },
  brandName: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  tagline: { fontSize: 14, color: '#8B949E', marginTop: 4, letterSpacing: 1 },
  welcomeTextSection: { marginBottom: 32, alignItems: 'center' },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subText: { fontSize: 16, color: '#C9D1D9', marginTop: 8 },
  form: { gap: 14 },
  inputWrapper: { gap: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#161B22', borderRadius: 16,
    borderWidth: 1, borderColor: '#30363D', height: 56, paddingHorizontal: 16,
  },
  inputError: { borderColor: '#FF453A' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16 },
  eyeBtn: { padding: 4 },
  errorText: { color: '#FF453A', fontSize: 12, marginLeft: 4 },
  globalErrorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#2D1B1B', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#FF453A33',
  },
  globalErrorText: { color: '#FF453A', fontSize: 14, flex: 1 },
  primaryBtn: {
    backgroundColor: '#00E676', height: 56,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  primaryBtnText: { color: '#0D1117', fontSize: 16, fontWeight: 'bold' },
  btnDisabled: { opacity: 0.6 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#30363D' },
  dividerText: { color: '#8B949E', fontSize: 14 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#161B22', height: 56, borderRadius: 16,
    borderWidth: 1, borderColor: '#30363D',
  },
  googleBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  guestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent', height: 56, borderRadius: 16,
    borderWidth: 1, borderColor: '#30363D', borderStyle: 'dashed',
  },
  guestBtnText: { color: '#8B949E', fontSize: 16, fontWeight: '600' },
  iconGap: { marginRight: 12 },
  guestWarning: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#161B22', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#30363D',
  },
  guestWarningText: { color: '#8B949E', fontSize: 12, flex: 1, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#8B949E', fontSize: 14 },
  linkText: { color: '#00E676', fontSize: 14, fontWeight: 'bold' },
});