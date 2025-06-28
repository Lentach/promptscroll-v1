import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FollowButton } from '../FollowButton';

// Mock auth hook so current user has id 'me'
vi.mock('@/features/auth/hooks/useUser', () => ({
  useUser: () => ({ user: { id: 'me' } }),
}));

// Helper to create wrapper with react-query client
const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

// Prepare spies that we can modify per-test
const mockUseFollowStatus = vi.fn();
const mockUseFollowToggle = vi.fn();

vi.mock('@/features/follow/hooks/useFollowStatus', () => ({
  useFollowStatus: (...args: any[]) => mockUseFollowStatus(...args),
}));

vi.mock('@/features/follow/hooks/useFollowToggle', () => ({
  useFollowToggle: (...args: any[]) => mockUseFollowToggle(...args),
}));

describe('FollowButton', () => {
  it('shows "Follow" and triggers mutate on click', () => {
    const mutate = vi.fn();
    mockUseFollowStatus.mockReturnValue({ data: false, isLoading: false });
    mockUseFollowToggle.mockReturnValue({ mutate, isPending: false });

    renderWithClient(<FollowButton targetUserId="bob" />);

    const btn = screen.getByRole('button', { name: /follow/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mutate).toHaveBeenCalled();
  });

  it('shows "Followed" when already following', () => {
    mockUseFollowStatus.mockReturnValue({ data: true, isLoading: false });
    mockUseFollowToggle.mockReturnValue({ mutate: vi.fn(), isPending: false });

    renderWithClient(<FollowButton targetUserId="bob" />);

    expect(screen.getByRole('button', { name: /followed/i })).toBeInTheDocument();
  });

  it('disables button when targetUserId is self', () => {
    mockUseFollowStatus.mockReturnValue({ data: false, isLoading: false });
    mockUseFollowToggle.mockReturnValue({ mutate: vi.fn(), isPending: false });
    renderWithClient(<FollowButton targetUserId="me" />);
    const btn = screen.getByRole('button', { name: /you/i });
    expect(btn).toBeDisabled();
  });
}); 