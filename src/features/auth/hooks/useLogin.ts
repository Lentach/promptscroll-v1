import { useMutation } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () =>
  useMutation<Session, Error, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      return data.session as Session;
    },
  }); 