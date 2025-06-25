import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

/**
 * Hook to conveniently access authentication context.
 * Throws when used outside of <AuthProvider>.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}; 