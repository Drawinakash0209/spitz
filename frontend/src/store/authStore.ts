import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type User = {
  id: string;
  email: string;
  role: 'ADMIN' | 'CLINIC';
  clinic_id?: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    set({
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        clinic_id: profile.clinic_id,
      },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({
            user: {
              id: profile.id,
              email: profile.email,
              role: profile.role,
              clinic_id: profile.clinic_id,
            },
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      set({ loading: false });
    }
  },
}));