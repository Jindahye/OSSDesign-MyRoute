export interface UserPreferences {
  slope: boolean;
  wheeled: boolean;
  walking: boolean;
  running: boolean;
}

export interface StoredUser {
  kakao_id?: string;
  id?: string;
  nickname?: string;
  profile_image?: string;
  slope?: number;
  wheeled?: number;
  walking?: number;
  running?: number;
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getKakaoId(): string | null {
  const user = getStoredUser();
  return user?.kakao_id ?? user?.id ?? null;
}

export function syncPreferencesFromUser(user: StoredUser) {
  const preferences: UserPreferences = {
    slope: !!user.slope,
    wheeled: !!user.wheeled,
    walking: !!user.walking,
    running: !!user.running,
  };
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
  return preferences;
}

export function clearSession() {
  localStorage.removeItem('user');
  localStorage.removeItem('temp_user');
  localStorage.removeItem('userPreferences');
}
