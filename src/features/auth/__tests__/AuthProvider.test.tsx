/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../context/AuthProvider';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

// ---------------------------
// Mock Supabase client
// ---------------------------

let getSessionMock;
let onAuthStateChangeMock;

// ---------------------------
// Helper test component
// ---------------------------

const AuthStateViewer: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();
  return (
    <>
      <span data-testid="loading">{loading ? 'loading' : 'ready'}</span>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
    </>
  );
};

// ---------------------------
// Tests
// ---------------------------

describe('AuthProvider', () => {
  beforeEach(() => {
    getSessionMock = vi.spyOn(supabase.auth, 'getSession');
    onAuthStateChangeMock = vi.spyOn(supabase.auth, 'onAuthStateChange');
    onAuthStateChangeMock.mockImplementation((cb) => {
      // Immediately invoke the callback to mimic Supabase behaviour for the initial session event.
      cb('INITIAL_SESSION', null);
      return { data: { subscription: { unsubscribe: vi.fn() } } } as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children and exposes unauthenticated state when no session', async () => {
    getSessionMock.mockResolvedValueOnce({ data: { session: null }, error: null });

    render(
      <AuthProvider>
        <AuthStateViewer />
      </AuthProvider>,
    );

    // Loading should eventually become ready
    expect(await screen.findByTestId('loading')).toHaveTextContent('ready');
    // isAuthenticated should be false
    expect(screen.getByTestId('auth')).toHaveTextContent('no');
  });

  it('exposes authenticated state when a session exists', async () => {
    const fakeSession = {
      access_token: 'token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      refresh_token: 'refresh',
      user: { id: '123', aud: 'authenticated', role: 'authenticated', email: 'test@example.com' },
    } as unknown as import('@supabase/supabase-js').Session;

    getSessionMock.mockResolvedValueOnce({ data: { session: fakeSession }, error: null });

    render(
      <AuthProvider>
        <AuthStateViewer />
      </AuthProvider>,
    );

    // Ensure provider finished initial fetch
    expect(await screen.findByTestId('loading')).toHaveTextContent('ready');

    // Wait for session state to propagate
    await screen.findByTestId('auth');
    expect(screen.getByTestId('auth')).toHaveTextContent('yes');
  });

  it('useAuth throws when used outside AuthProvider', () => {
    const ThrowingComponent = () => {
      useAuth();
      return null;
    };

    expect(() => render(<ThrowingComponent />)).toThrow(
      'useAuth must be used within an AuthProvider',
    );
  });
}); 