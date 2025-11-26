import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import RoleAdaptiveWidget from './RoleAdaptiveWidget';
import { AuthProvider } from '@/context/AuthContext';
import React from 'react'; // Ensure React is available for the mock JSX

// --- 1. Mock the AuthContext ---
const mockUser = vi.fn();

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/AuthContext')>();
  return {
    ...actual,
    // Explicitly mock AuthProvider as a pass-through component
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: () => ({
      user: mockUser(),
    }),
  };
});

describe('RoleAdaptiveWidget Component', () => {
  // ... rest of your tests remain exactly the same ...
  // --- TEST CASE 1: ADMIN VIEW ---
  it('renders Admin dashboard when user role is ADMIN', () => {
    mockUser.mockReturnValue({ role: 'ADMIN', name: 'Admin User' });

    render(
      <AuthProvider>
        <RoleAdaptiveWidget />
      </AuthProvider>,
    );

    expect(screen.getByText('Quản trị viên')).toBeInTheDocument();
    // ... assertions
  });

  // --- TEST CASE 3: GUEST VIEW ---
  it('renders Guest call-to-action when user is NOT logged in', () => {
    mockUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <RoleAdaptiveWidget />
      </AuthProvider>,
    );

    expect(screen.getByText('Xin chào quý khách')).toBeInTheDocument();
    // ... assertions
  });
});
