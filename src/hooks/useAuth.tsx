import { useState, useEffect, useCallback } from 'react';
import { api, User } from '@/services/api';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      api.getCurrentUser().then(({ data, error }) => {
        if (error) {
          api.clearAuthTokens();
          setUser(null);
        } else if (data) {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await api.register(email, password, fullName);

      if (error) {
        toast.error(error);
        return { error };
      }

      if (data) {
        setUser(data.user);
        toast.success('Account created successfully!');
      }
      
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      return { error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await api.login(email, password);

      if (error) {
        toast.error(error);
        return { error };
      }

      if (data) {
        setUser(data.user);
        toast.success('Signed in successfully!');
      }
      
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      return { error };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Google OAuth would need to be implemented on the Spring Boot side
    // For now, show a message that this feature requires backend setup
    toast.error('Google sign-in requires backend OAuth configuration');
    return { error: new Error('Not implemented') };
  }, []);

  const signOut = useCallback(async () => {
    try {
      api.clearAuthTokens();
      setUser(null);
      toast.success('Signed out successfully');
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      return { error };
    }
  }, []);

  const updateProfile = useCallback(async (fullName: string, avatarUrl?: string) => {
    try {
      const { data, error } = await api.updateProfile(fullName, avatarUrl);

      if (error) {
        toast.error(error);
        return { error };
      }

      if (data) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('Profile updated successfully');
      }
      
      return { error: null, data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      return { error };
    }
  }, []);

  return {
    user,
    session: user ? { user } : null, // Compatibility layer
    loading,
    signInWithGoogle,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
}
