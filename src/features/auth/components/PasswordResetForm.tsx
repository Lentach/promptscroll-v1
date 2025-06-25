import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePasswordReset } from '../hooks/usePasswordReset';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertCircle, CheckCircle } from 'lucide-react';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetInput = z.infer<typeof resetSchema>;

interface PasswordResetFormProps {
  onSuccess?: () => void;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetInput>({ resolver: zodResolver(resetSchema) });

  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const resetMutation = usePasswordReset();

  const onSubmit = handleSubmit(async (data: ResetInput) => {
    setFormError(null);
    try {
      await resetMutation.mutateAsync(data);
      setSent(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to send reset email');
    }
  });

  if (sent) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center space-y-4">
        <CheckCircle size={32} className="mx-auto text-green-400" />
        <p className="text-white">Password reset email sent. Check your inbox.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-white text-center">Reset your password</h2>

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

      {formError && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle size={14} /> {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={resetMutation.isPending}
        className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
      >
        {resetMutation.isPending && <LoadingSpinner size="sm" />} Send Reset Email
      </button>
    </form>
  );
}; 