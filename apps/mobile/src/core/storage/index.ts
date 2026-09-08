import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageHelper {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn('Storage.getItem failed:', e);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage.setItem failed:', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage.removeItem failed:', e);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('Storage.clear failed:', e);
    }
  }
}

export const Storage = new StorageHelper();
export default Storage;
