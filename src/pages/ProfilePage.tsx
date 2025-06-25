import React from 'react';
import { useUser } from '@/features/auth/hooks/useUser';

export const ProfilePage: React.FC = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <p>Email: {user.email}</p>
      <p>Display name: {(user.user_metadata?.display_name as string) ?? 'n/a'}</p>
    </div>
  );
}; 