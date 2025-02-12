import { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthSession } from '@/lib/auth';

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
    const interval = setInterval(refreshSession, 4 * 60 * 1000); // Refresh a cada 4 minutos
    return () => clearInterval(interval);
  }, []);

  async function checkSession() {
    try {
      const session = await authService.getSession();
      setSession(session);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSession() {
    try {
      const session = await authService.refreshSession();
      setSession(session);
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const session = await authService.login({ email, password });
      setSession(session);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      await authService.register({ email, password, full_name: fullName });
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await authService.logout();
      setSession(null);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}