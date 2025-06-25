import { useMutation } from '@tanstack/react-query';
import { AuthApiError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

interface ResetPayload {
  email: string;
}

export const usePasswordReset = () =>
  useMutation<null, AuthApiError, ResetPayload>({
    mutationFn: async ({ email }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      return null;
    },
  }); 