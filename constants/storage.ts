import { Platform } from 'react-native';

const storage = Platform.OS === 'web'
  ? {
      getItem: async (key: string) => localStorage.getItem(key),
      setItem: async (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: async (key: string) => localStorage.removeItem(key),
    }
  : require('@react-native-async-storage/async-storage').default;

export default storage;