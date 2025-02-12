import { supabase } from './supabase';

export interface AuthSession {
  user: {
    id: string;
    email: string;
    full_name: string;
  } | null;
  expires_at?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string;
}

class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login({ email, password }: LoginCredentials): Promise<AuthSession> {
    try {
      const { data, error } = await supabase.rpc('login', {
        p_email: email,
        p_password: password
      });

      if (error) throw error;

      this.currentSession = {
        user: data.user,
        expires_at: data.expires_at
      };

      return this.currentSession;
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  }

  async register({ email, password, full_name }: RegisterCredentials): Promise<void> {
    try {
      const { error } = await supabase.rpc('register_user', {
        p_email: email,
        p_password: password,
        p_full_name: full_name
      });

      if (error) throw error;
    } catch (error) {
      throw new Error('Erro ao criar conta');
    }
  }

  async logout(): Promise<void> {
    try {
      this.currentSession = null;
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      if (this.currentSession?.expires_at && Date.now() < this.currentSession.expires_at) {
        return this.currentSession;
      }

      const { data, error } = await supabase.rpc('get_session');
      if (error) throw error;

      if (data) {
        this.currentSession = {
          user: data.user,
          expires_at: data.expires_at
        };
        return this.currentSession;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async refreshSession(): Promise<AuthSession | null> {
    try {
      const { data, error } = await supabase.rpc('refresh_session');
      if (error) throw error;

      if (data) {
        this.currentSession = {
          user: data.user,
          expires_at: data.expires_at
        };
        return this.currentSession;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

export const authService = AuthService.getInstance();