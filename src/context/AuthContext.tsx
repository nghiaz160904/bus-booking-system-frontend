import React, { useMemo, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '@/lib/api/axios';
import { getMe, refreshToken as refreshAuthToken, logoutUser } from '@/lib/api/auth';
import { type UserProfile } from '@/types/auth';

// Import the Context from the new file
import { AuthContext } from '../hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Use React Query to fetch the user's profile
  const {
    data: user,
    isLoading: isLoadingUser,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getMe,
    enabled: false,
    retry: 1,
    staleTime: Infinity,
  });

  // --- Check auth status on load ---
  useEffect(() => {
    refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear();
    }
  }, [queryClient]);

  const login = useCallback(
    (data: UserProfile) => {
      queryClient.setQueryData(['currentUser'], data);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    [queryClient],
  );

  useEffect(() => {
    if (isError) {
      queryClient.setQueryData(['currentUser'], null);
    }
  }, [isError, queryClient]);

  // --- Setup Axios Interceptors ---
  useEffect(() => {
    const responseIntercept = apiPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newUser = await refreshAuthToken();
            login(newUser);
            return apiPrivate(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [login, logout]);

  const isLoggedIn = !!user;

  const hasRole = useCallback(
    (required: string | string[]) => {
      if (!user) return false;
      const needed = Array.isArray(required) ? required : [required];
      return needed.includes(user.role);
    },
    [user],
  );

  const contextValue = useMemo(
    () => ({
      user: user || null,
      accessToken: null,
      isLoggedIn,
      isLoadingUser,
      login,
      logout,
      hasRole,
    }),
    [user, isLoggedIn, isLoadingUser, login, logout, hasRole],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
