import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Language } from '../types';
import { getCurrentUserApi, loginApi, logoutApi, updateUserLanguageApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  language: Language;
  dir: 'ltr' | 'rtl';
  isLoading: boolean;
  login: (role: Role, identifier: string, passwordInput: string) => Promise<User>;
  logout: () => Promise<void>;
  setLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  const dir: 'ltr' | 'rtl' = language === 'ps' || language === 'ur' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const u = await getCurrentUserApi();
        if (u) {
          setUser(u);
          if (u.language) setLanguageState(u.language);
        }
      } catch (e) {
        console.error('Failed to load stored auth user', e);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (r: Role, identifier: string, passwordInput: string): Promise<User> => {
    setIsLoading(true);
    try {
      const u = await loginApi(r, identifier, passwordInput);
      setUser(u);
      if (u.language) setLanguageState(u.language);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (user) {
      setUser({ ...user, language: lang });
      updateUserLanguageApi(user.id, lang);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        language,
        dir,
        isLoading,
        login,
        logout,
        setLanguage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
