import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserData } from './types';

const KEY = 'breathe:userData:v1';

export async function loadUserData(): Promise<UserData | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

export async function saveUserData(data: UserData): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export async function clearUserData(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
