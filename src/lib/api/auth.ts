import { AxiosError } from 'axios'; // Import AxiosError type
import { type LoginType, type RegisterType } from '@/schemas/auth';
import { apiClient, apiPrivate } from './axios';
import { type RegisterResponse, type UserProfile } from '@/types/auth';

// Define the shape of the error response from your backend
// Based on your code: checks for .error or .message
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

/**
 * Handles new user registration
 * POST /user/register
 */
export const registerUser = async (data: RegisterType): Promise<RegisterResponse> => {
  try {
    // Use the PUBLIC 'apiClient'
    const response = await apiClient.post<RegisterResponse>('/user/register', data);
    return response.data;
  } catch (err) {
    // Cast the error to AxiosError with our specific response type
    const error = err as AxiosError<ApiErrorResponse>;

    throw new Error(error.response?.data?.error || error.message || 'Registration failed');
  }
};

/**
 * Handles user login
 * POST /user/login
 * Now returns UserProfile, not tokens
 */
export const loginUser = async (data: LoginType): Promise<UserProfile> => {
  try {
    const response = await apiClient.post<UserProfile>('/user/login', data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;

    throw new Error(error.response?.data?.error || error.message || 'Invalid email or password');
  }
};

/**
 * Handles refreshing the access token
 * POST /user/refresh
 * Now takes no body and returns UserProfile
 */
export const refreshToken = async (): Promise<UserProfile> => {
  try {
    // No body is sent, the cookie is sent automatically
    const response = await apiClient.post<UserProfile>('/user/refresh');
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;

    throw new Error(error.response?.data?.message || 'Session expired. Please log in again.');
  }
};

/**
 * Fetches the current user's profile
 * GET /user/me
 */
export const getMe = async (): Promise<UserProfile> => {
  try {
    const response = await apiPrivate.get<UserProfile>('/user/me');
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;

    throw new Error(error.response?.data?.message || 'Could not fetch user profile');
  }
};

/**
 * Logs the user out by clearing cookies on the backend
 * POST /user/logout
 */
export const logoutUser = async (): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>('/user/logout');
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;

    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};
