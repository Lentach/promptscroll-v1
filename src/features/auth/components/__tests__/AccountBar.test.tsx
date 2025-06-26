import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AccountBar } from '../AccountBar';
import { AuthContext } from '../../context/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const mockUser = {
  id: 'test-uid',
  email: 'test@example.com',
  user_metadata: { display_name: 'Tester' },
} as any;

vi.mock('../hooks/useLogout', () => {
  return {
    useLogout: () => ({ mutate: vi.fn() }),
  };
});

vi.mock('@/components/LoadingSpinner', () => ({ LoadingSpinner: () => null }));

describe('AccountBar & ProfileModal', () => {
  it('opens profile modal and shows logout', async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={{ session: { user: mockUser } as any, loading: false, isAuthenticated: true }}>
            <AccountBar />
          </AuthContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>,
    );

    // click avatar/name button
    const button = screen.getByRole('button', { name: /tester/i });
    fireEvent.click(button);

    // modal elements
    const logoutBtn = await screen.findByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeDefined();
  });
}); 