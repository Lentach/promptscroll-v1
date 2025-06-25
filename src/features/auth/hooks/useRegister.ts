import { useMutation } from '@tanstack/react-query';
import { Session, AuthApiError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

interface RegisterPayload {
  email: string;
  password: string;
  // Additional metadata e.g. displayName
  displayName?: string;
}

export const useRegister = () =>
  useMutation<Session | null, AuthApiError, RegisterPayload>({
    mutationFn: async ({ email, password, displayName }) => {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: displayName ? { display_name: displayName } : undefined,
        },
      });

      if (error) throw error;

      // In email confirmation flow, session may be null until user verifies email.
      return data.session;
    },
  }); 