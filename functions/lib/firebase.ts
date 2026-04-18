import { getApps, initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDSgAbBEnv6FxFD5Ypv3lssZu1w7-KRm1Y",
    authDomain: "caltrack-72fa8.firebaseapp.com",
    projectId: "caltrack-72fa8",
    storageBucket: "caltrack-72fa8.firebasestorage.app",
    messagingSenderId: "817061065777",
    appId: "1:817061065777:web:eee788a127f44deaad9110",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);