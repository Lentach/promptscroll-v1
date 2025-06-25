import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VerifyEmailPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const tryFetch = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else if (data.session) {
        setStatus('success');
        setMessage('Email confirmed! Redirecting...');
        setTimeout(() => navigate('/'), 3000);
      } else {
        // Wait a moment and retry – Supabase may still be processing url fragment
        setTimeout(tryFetch, 1000);
      }
    };
    tryFetch();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 text-white p-4">
      <div className="bg-slate-800/90 p-8 rounded-lg flex flex-col items-center space-y-4 max-w-sm w-full text-center">
        {status === 'loading' && <Loader className="animate-spin h-8 w-8" />}
        {status === 'success' && <CheckCircle className="h-8 w-8 text-green-400" />}
        {status === 'error' && <AlertCircle className="h-8 w-8 text-red-400" />}
        <p>{message}</p>
      </div>
    </div>
  );
}; 