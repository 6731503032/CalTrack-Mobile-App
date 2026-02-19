import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// FIXED PATH: Moving up two levels to reach constants
import { Routes } from '../../constants/Routes'; 

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      
      <View style={styles.content}>
        {/* CalTrack Logo Placeholder */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="fitness" size={50} color="#00E676" />
          </View>
          <Text style={styles.brandName}>CalTrack</Text>
          <Text style={styles.tagline}>Intuitive Fitness Tracking</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeTextSection}>
          <Text style={styles.mainTitle}>Welcome</Text>
          <Text style={styles.subText}>Start or sign in to your account</Text>
        </View>

        {/* Login Options */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.googleBtn} 
            activeOpacity={0.8}
            onPress={() => router.replace(Routes.TABS)}
          >
            <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.iconGap} />
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.emailBtn} 
            activeOpacity={0.8}
            onPress={() => router.replace(Routes.TABS)}
          >
            <Ionicons name="mail" size={20} color="#0D1117" style={styles.iconGap} />
            <Text style={styles.emailBtnText}>Sign in with Email</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => {/* Navigate to Sign In if separate */}}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#0D1117',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 30, 
    justifyContent: 'center' 
  },

  // Logo Design
  logoSection: { alignItems: 'center', marginBottom: 50 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#161B22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#30363D',
    marginBottom: 15
  },
  brandName: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  tagline: { fontSize: 14, color: '#8B949E', marginTop: 4, letterSpacing: 1 },

  // Welcome Text
  welcomeTextSection: { marginBottom: 40, alignItems: 'center' },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subText: { fontSize: 16, color: '#C9D1D9', marginTop: 8 },

  // Buttons (Increased Touch Targets)
  actionSection: { gap: 14 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161B22',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D'
  },
  googleBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E676', // Lime Green Primary
    height: 56,
    borderRadius: 16
  },
  emailBtnText: { color: '#0D1117', fontSize: 16, fontWeight: 'bold' },
  iconGap: { marginRight: 12 },

  // Footer
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 30 
  },
  footerText: { color: '#8B949E', fontSize: 14 },
  linkText: { color: '#00E676', fontSize: 14, fontWeight: 'bold' }
});