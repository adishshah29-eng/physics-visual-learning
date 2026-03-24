import { create } from 'zustand';
import { supabase, type Profile, type ProfileUpdate } from '@/lib/supabase';
import { getProfile, upsertProfile } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null, needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileUpdate>) => Promise<{ error: string | null }>;
  setProfile: (profile: Profile | null) => void;
}

let authSubscription: any = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }

      set({ isLoading: true });

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await getProfile(session.user.id);
        set({
          user: session.user,
          profile,
          isAuthenticated: true,
          isLoading: false,
        });

        // Update last_seen
        if (profile) {
          await upsertProfile({ id: session.user.id, last_seen: new Date().toISOString() });
        }
      } else {
        set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await getProfile(session.user.id);
          set({
            user: session.user,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      });
      authSubscription = subscription;
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };

    // Rely on the onAuthStateChange listener to set user and profile
    return { error: null };
  },

  signUpWithEmail: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };

    // Supabase returns an empty identities array for existing users instead of an error
    // when email confirmations are enabled and security settings are high.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { 
        error: 'An account with this email already exists. Please sign in.', 
        needsEmailConfirmation: false 
      };
    }

    if (data.user && data.session) {
      // Rely on the onAuthStateChange listener to set user and profile
      return { error: null, needsEmailConfirmation: false };
    } else if (data.user && !data.session) {
      return { error: null, needsEmailConfirmation: true };
    }
    return { error: null };
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during global sign out:', error);
    } finally {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
      });
    }
  },

  updateProfile: async (updates: Partial<ProfileUpdate>) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };

    const { data: result, error: upsertError } = await upsertProfile({
      id: user.id,
      ...updates,
    } as Profile);

    if (result && !upsertError) {
      set({ profile: result });
      return { error: null };
    }
    return { error: `Failed to update profile: ${upsertError?.message || 'Unknown error'}` };
  },

  setProfile: (profile: Profile | null) => {
    set({ profile });
  },
}));
