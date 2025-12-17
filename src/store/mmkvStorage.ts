import en from 'translation/en';
import { createMMKV } from 'react-native-mmkv'
import { StateStorage } from 'zustand/middleware';
import { ENCRYPTION_KEY, APP_KEY } from '@env';

const storage = createMMKV({
  id: 'APP_KEY',
  encryptionKey: 'UY6Dum0TGsxzRLGMuaeYCKeUp5rMq8TN',
  mode: 'multi-process',
});

const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

export default mmkvStorage;
