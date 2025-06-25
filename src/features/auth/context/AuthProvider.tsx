import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

/**
 * src/features/auth/context/AuthProvider.tsx
 * Centralised context for authentication state.
 *
 * The provider is responsible for:
 * 1. Fetching the initial session on mount.
 * 2. Subscribing to Supabase `onAuthStateChange` events so the app reacts
 *    immediately to sign-in / sign-out / token refresh events.
 * 3. Exposing a simple, serialisable context value that other hooks/components
 *    can consume (implemented in B3.2).
 *
 * We purposefully keep the API minimal for now – only the session and a few
 * booleans.  Higher-level helpers (e.g. `useLogin`, `useRegister`) will build
 * on top of this in the next sub-tasks.
 */

// ----------------------
// Context & Types
// ----------------------

interface AuthContextValue {
  /** Raw Supabase session – `null` if the user is logged out. */
  session: Session | null;
  /** `true` once the initial session fetch has completed. */
  loading: boolean;
  /** Convenience boolean – `true` when a valid session is present. */
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ----------------------
// Provider Component
// ----------------------

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch current session on mount and set up listener for future changes.
  useEffect(() => {
    (async () => {
      const {
        data: { session: activeSession },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('src/features/auth/context/AuthProvider.tsx: Failed to fetch initial session', error);
      }

      setSession(activeSession);
      setLoading(false);

      console.log('src/features/auth/context/AuthProvider.tsx: Initial session loaded', {
        hasSession: !!activeSession,
      });
    })();

    // Listen to auth state changes (sign-in / sign-out / token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`src/features/auth/context/AuthProvider.tsx: Auth state change -> ${event}`);
      setSession(newSession);
    });

    // Clean up the listener on unmount.
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    session,
    loading,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 