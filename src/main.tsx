import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './features/auth/context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthModal } from './features/auth/components/AuthModal';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';

// Create a single QueryClient instance for the whole app
const queryClient = new QueryClient();

// Performance monitoring
if (import.meta.env.DEV) {
  console.log('🚀 PromptScroll starting in development mode');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<AuthModal isOpen defaultTab="login" onClose={() => window.history.back()} />} />
            <Route path="/register" element={<AuthModal isOpen defaultTab="register" onClose={() => window.history.back()} />} />
            <Route path="/forgot-password" element={<AuthModal isOpen defaultTab="reset" onClose={() => window.history.back()} />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            {/* Profile route protected will be added later */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
);
