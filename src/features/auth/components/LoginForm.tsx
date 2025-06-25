import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormInput } from '../schemas';
import { useLogin } from '../hooks/useLogin';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({ resolver: zodResolver(loginSchema) });

  const [formError, setFormError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const onSubmit = handleSubmit(async (data: LoginFormInput) => {
    setFormError(null);
    try {
      await loginMutation.mutateAsync(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setFormError(err?.message || 'Login failed');
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-white text-center">Sign in to your account</h2>

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

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
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
        disabled={loginMutation.isPending}
        className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
      >
        {loginMutation.isPending && <LoadingSpinner size="sm" />} Sign In
      </button>
    </form>
  );
}; 