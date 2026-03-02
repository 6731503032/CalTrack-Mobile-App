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
    GoogleAuthProvider,
    signInAnonymously,
    signInWithEmailAndPassword,
    signInWithPopup,
} from '@firebase/auth';
import { GoalStore } from '../../constants/GoalStore';

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

// --- HELPERS ---
function parseFirebaseError(code: string): string {
    switch (code) {
        case 'auth/user-not-found': return 'No account found with this email';
        case 'auth/wrong-password': return 'Incorrect password';
        case 'auth/email-already-in-use': return 'An account with this email already exists';
        case 'auth/invalid-email': return 'Invalid email address';
        default: return 'Something went wrong. Please try again';
    }
}

export default function LoginScreen() {
    const router = useRouter();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);

    // Load data on boot
    useEffect(() => {
        GoalStore.hydrate();
    }, []);

    // --- NAVIGATION LOGIC ---
    const handleNavigation = async () => {
        // Force refresh from storage to ensure we aren't using stale 'Bon' data
        const goals = await GoalStore.hydrate();
        
        // If name is empty, null, or whitespace, force Setup
        const nameIsMissing = !goals.name || goals.name.trim() === '';

        if (nameIsMissing) {
            router.replace('/setup_name');
        } else {
            router.replace('/(tabs)/home');
        }
    };

    // --- AUTH ACTIONS ---
    const handleEmailAuth = async () => {
        setGlobalError('');
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

    const handleGoogleAuth = async () => {
        setGlobalError('');
        setGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            await handleNavigation();
        } catch (e: any) {
            setGlobalError(parseFirebaseError(e.code));
        } finally {
            setGoogleLoading(false);
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

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    <View style={styles.logoSection}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="fitness" size={50} color="#00E676" />
                        </View>
                        <Text style={styles.brandName}>CalTrack</Text>
                        <Text style={styles.tagline}>Intuitive Fitness Tracking</Text>
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

                        <TouchableOpacity style={styles.primaryBtn} onPress={handleEmailAuth} disabled={loading}>
                            {loading ? <ActivityIndicator color="#0D1117" /> : <Text style={styles.primaryBtnText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>}
                        </TouchableOpacity>

                        <View style={styles.divider}><View style={styles.line} /><Text style={styles.dividerText}>or</Text><View style={styles.line} /></View>

                        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleAuth} disabled={googleLoading}>
                            <Ionicons name="logo-google" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
                            <Text style={styles.googleBtnText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.guestBtn} onPress={handleGuestLogin} disabled={guestLoading}>
                            {guestLoading ? <ActivityIndicator color="#8B949E" /> : <Text style={styles.guestBtnText}>Continue as Guest</Text>}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</Text>
                        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                            <Text style={styles.linkText}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0D1117' },
    scroll: { flexGrow: 1, padding: 30, justifyContent: 'center' },
    logoSection: { alignItems: 'center', marginBottom: 40 },
    logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
    brandName: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginTop: 10 },
    tagline: { color: '#8B949E', fontSize: 14 },
    form: { gap: 15 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 16, paddingHorizontal: 15, height: 56, borderWidth: 1, borderColor: '#30363D' },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, color: '#FFFFFF' },
    errorText: { color: '#FF453A', textAlign: 'center' },
    primaryBtn: { backgroundColor: '#00E676', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    primaryBtnText: { color: '#0D1117', fontWeight: 'bold', fontSize: 16 },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    line: { flex: 1, height: 1, backgroundColor: '#30363D' },
    dividerText: { color: '#8B949E', marginHorizontal: 10 },
    googleBtn: { flexDirection: 'row', backgroundColor: '#161B22', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
    googleBtnText: { color: '#FFFFFF', fontWeight: '600' },
    guestBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#30363D' },
    guestBtnText: { color: '#8B949E', fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    footerText: { color: '#8B949E' },
    linkText: { color: '#00E676', fontWeight: 'bold' }
});