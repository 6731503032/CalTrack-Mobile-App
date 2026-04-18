import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

import { getApps, initializeApp } from '@firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInAnonymously,
    signInWithEmailAndPassword,
} from '@firebase/auth';
import { seedFoodDatabase } from '../functions/lib/seedFoods'; // ← NEW
import { GoalStore } from '../constants/GoalStore';

// --- FIREBASE SETUP ---
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

// Sign In = green accent, Sign Up = blue accent
const SIGNIN_ACCENT = '#00E676';
const SIGNUP_ACCENT = '#00B4D8';

// --- HELPERS ---
function parseFirebaseError(code: string): string {
    switch (code) {
        case 'auth/user-not-found':       return 'No account found with this email';
        case 'auth/wrong-password':        return 'Incorrect password';
        case 'auth/email-already-in-use':  return 'An account with this email already exists';
        case 'auth/invalid-email':         return 'Invalid email address';
        case 'auth/invalid-credential':    return 'Incorrect email or password';
        case 'auth/weak-password':         return 'Password must be at least 6 characters';
        default:                           return 'Something went wrong. Please try again';
    }
}

export default function LoginScreen() {
    const router = useRouter();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);

    useEffect(() => {
        GoalStore.hydrate();
    }, []);

    const handleSwitch = () => {
        setIsSignUp(!isSignUp);
        setGlobalError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    // --- NAVIGATION ---
    const handleNavigation = async () => {
        await seedFoodDatabase(); // ← NEW: seeds foods to Firestore once, skips if already done
        const goals = await GoalStore.hydrate();
        const nameIsMissing = !goals.name || goals.name.trim() === '';
        if (nameIsMissing) {
            router.replace('/setup_name');
        } else {
            router.replace('/(tabs)/home');
        }
    };

    // --- AUTH ---
    const handleEmailAuth = async () => {
        setGlobalError('');

        if (isSignUp && password !== confirmPassword) {
            setGlobalError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            await handleNavigation();
        } catch (e: any) {
            setGlobalError(parseFirebaseError(e.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setGlobalError('');
        setGuestLoading(true);
        try {
            await signInAnonymously(auth);
            await handleNavigation();
        } catch (e: any) {
            setGlobalError(parseFirebaseError(e.code));
        } finally {
            setGuestLoading(false);
        }
    };

    // ─── SIGN IN PAGE ─────────────────────────────────────────────────
    if (!isSignUp) {
        return (
            <SafeAreaView style={styles.root}>
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                        <View style={styles.logoSection}>
                            <View style={[styles.logoCircle, { borderColor: SIGNIN_ACCENT }]}>
                                <Ionicons name="fitness" size={50} color={SIGNIN_ACCENT} />
                            </View>
                            <Text style={styles.brandName}>CalTrack</Text>
                            <Text style={styles.tagline}>Welcome back 👋</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputRow}>
                                <Ionicons name="mail-outline" size={20} color="#8B949E" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email address"
                                    placeholderTextColor="#8B949E"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <Ionicons name="lock-closed-outline" size={20} color="#8B949E" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#8B949E"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8B949E" />
                                </TouchableOpacity>
                            </View>

                            {globalError ? <Text style={styles.errorText}>{globalError}</Text> : null}

                            <TouchableOpacity
                                style={[styles.primaryBtn, { backgroundColor: SIGNIN_ACCENT }]}
                                onPress={handleEmailAuth}
                                disabled={loading}
                            >
                                {loading
                                    ? <ActivityIndicator color="#0D1117" />
                                    : <Text style={styles.primaryBtnText}>Sign In</Text>
                                }
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.line} />
                                <Text style={styles.dividerText}>or</Text>
                                <View style={styles.line} />
                            </View>

                            <TouchableOpacity style={styles.guestBtn} onPress={handleGuestLogin} disabled={guestLoading}>
                                {guestLoading
                                    ? <ActivityIndicator color="#8B949E" />
                                    : <Text style={styles.guestBtnText}>Continue as Guest</Text>
                                }
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleSwitch}>
                                <Text style={[styles.linkText, { color: SIGNIN_ACCENT }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // ─── SIGN UP PAGE ─────────────────────────────────────────────────
    return (
        <SafeAreaView style={[styles.root, { backgroundColor: '#0A1628' }]}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    <View style={styles.logoSection}>
                        <View style={[styles.logoCircle, { borderColor: SIGNUP_ACCENT, backgroundColor: '#0D1F3C' }]}>
                            <Ionicons name="person-add" size={44} color={SIGNUP_ACCENT} />
                        </View>
                        <Text style={styles.brandName}>Create Account</Text>
                        <Text style={styles.tagline}>Start your fitness journey 🚀</Text>
                    </View>

                    {/* Blue top accent bar — visually distinct from sign in */}
                    <View style={[styles.accentBar, { backgroundColor: SIGNUP_ACCENT }]} />

                    {/* Slightly different card background */}
                    <View style={styles.signUpCard}>

                        <View style={[styles.inputRow, styles.signUpInput]}>
                            <Ionicons name="mail-outline" size={20} color={SIGNUP_ACCENT} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email address"
                                placeholderTextColor="#8B949E"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={[styles.inputRow, styles.signUpInput]}>
                            <Ionicons name="lock-closed-outline" size={20} color={SIGNUP_ACCENT} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#8B949E"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8B949E" />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm password — only on sign up */}
                        <View style={[styles.inputRow, styles.signUpInput]}>
                            <Ionicons name="shield-checkmark-outline" size={20} color={SIGNUP_ACCENT} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                placeholderTextColor="#8B949E"
                                secureTextEntry={!showConfirm}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8B949E" />
                            </TouchableOpacity>
                        </View>

                        {globalError ? <Text style={styles.errorText}>{globalError}</Text> : null}

                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: SIGNUP_ACCENT }]}
                            onPress={handleEmailAuth}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#0A1628" />
                                : <Text style={styles.primaryBtnText}>Create Account</Text>
                            }
                        </TouchableOpacity>

                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleSwitch}>
                            <Text style={[styles.linkText, { color: SIGNUP_ACCENT }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root:           { flex: 1, backgroundColor: '#0D1117' },
    scroll:         { flexGrow: 1, padding: 30, justifyContent: 'center' },

    logoSection:    { alignItems: 'center', marginBottom: 30 },
    logoCircle:     { width: 100, height: 100, borderRadius: 50, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
    brandName:      { fontSize: 30, fontWeight: '900', color: '#FFFFFF', marginTop: 12 },
    tagline:        { color: '#8B949E', fontSize: 14, marginTop: 4 },

    form:           { gap: 15 },
    inputRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 16, paddingHorizontal: 15, height: 56, borderWidth: 1, borderColor: '#30363D' },
    inputIcon:      { marginRight: 10 },
    input:          { flex: 1, color: '#FFFFFF' },

    // Sign up specific
    accentBar:      { height: 3, borderRadius: 2, marginBottom: 20 },
    signUpCard:     { gap: 15, backgroundColor: '#0D1F3C', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1A3A5C' },
    signUpInput:    { backgroundColor: '#0A2040', borderColor: '#1A3A5C' },

    // Shared
    errorText:      { color: '#FF453A', textAlign: 'center', fontSize: 13 },
    primaryBtn:     { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
    primaryBtnText: { color: '#0D1117', fontWeight: 'bold', fontSize: 16 },
    divider:        { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
    line:           { flex: 1, height: 1, backgroundColor: '#30363D' },
    dividerText:    { color: '#8B949E', marginHorizontal: 10 },
    guestBtn:       { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#30363D' },
    guestBtnText:   { color: '#8B949E', fontWeight: '600' },
    footer:         { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    footerText:     { color: '#8B949E' },
    linkText:       { fontWeight: 'bold' },
});