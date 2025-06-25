import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

export const useLogout = () =>
  useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    },
  }); 