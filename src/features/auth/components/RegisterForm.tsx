import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormInput } from '../schemas';
import { useRegister } from '../hooks/useRegister';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onRegistered?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onRegistered }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerSchema) });

  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const registerMutation = useRegister();

  const onSubmit = handleSubmit(async (data: RegisterFormInput) => {
    setFormError(null);
    try {
      const session = await registerMutation.mutateAsync(data);
      if (!session) {
        // Email confirmation flow: Supabase returns null session
        setConfirmationSent(true);
      }
      if (onRegistered) onRegistered();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setFormError(err?.message || 'Registration failed');
    }
  });

  if (confirmationSent) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center space-y-4">
        <CheckCircle size={32} className="mx-auto text-green-400" />
        <p className="text-white">Please check your email to confirm your account.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-white text-center">Create an account</h2>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full px-3 py-2 rounded-md bg-gray-900/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Display Name */}
      <div className="space-y-1">
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-200">
          Display name
        </label>
        <input
          id="displayName"
          type="text"
          autoComplete="nickname"
          className="w-full px-3 py-2 rounded-md bg-gray-900/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="John Doe"
          {...register('displayName')}
        />
        {errors.displayName && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.displayName.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full px-3 py-2 rounded-md bg-gray-900/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.password.message}
          </p>
        )}
      </div>

      {/* Form error */}
      {formError && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle size={14} /> {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
      >
        {registerMutation.isPending && <LoadingSpinner size="sm" />} Sign Up
      </button>
    </form>
  );
}; 