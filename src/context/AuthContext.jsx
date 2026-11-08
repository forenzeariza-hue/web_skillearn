import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services';
import { getToken, registerUnauthorizedHandler, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => setUser(null));
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!getToken()) {
        if (active) setInitializing(false);
        return;
      }
      try {
        const currentUser = await authService.me();
        if (active) setUser(currentUser);
      } catch (_error) {
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setInitializing(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, initializing, isAuthenticated: Boolean(user), login, register, logout }),
    [user, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
}
