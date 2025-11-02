import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { setUser, setLoading, clearUser } from '../store/slices/UserSlice';
import api from '../axios/axios-config';
import type { UserRole } from '../store/slices/UserSlice';
import { showErrorToast, showSuccessToast, showWarningToast } from '../utils/toast';

interface ProtectedProps {
    children: React.ReactNode;
    requiredRole?: UserRole | UserRole[];
}

const Protected: React.FC<ProtectedProps> = ({ children, requiredRole }) => {
    const { user, isLoading } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Helper function to check if user has required role
    const hasRequiredRole = (userRole: UserRole, required?: UserRole | UserRole[]): boolean => {
        if (!required) return true; // No role requirement

        if (Array.isArray(required)) {
            return required.includes(userRole);
        }

        return userRole === required;
    };

    // Helper function to handle unauthorized access
    const handleUnauthorizedAccess = (reason?: string) => {
        // Show warning toast based on reason
        if (reason === 'insufficient_role') {
            showWarningToast('Access denied: Insufficient permissions for this page');
        } else if (reason === 'token_expired') {
            showErrorToast('Session expired. Please log in again');
        } else if (reason === 'invalid_token') {
            showErrorToast('Invalid session. Please log in again');
        } else {
            showErrorToast('Authentication required. Please log in');
        }

        // Clear user data and redirect to login
        dispatch(clearUser());
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                // No token found, redirect to login
                handleUnauthorizedAccess();
                return;
            }

            // If we have a token but no user in Redux, fetch user data from API
            if (token && !user) {
                try {
                    dispatch(setLoading(true));

                    // Call /auth/me API to get user data
                    const response = await api.get('/auth/me');

                    if (response.data.success && response.data.user) {
                        const userData = response.data.user;

                        // Map API response to our User interface
                        dispatch(setUser({
                            userId: userData._id,
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            role: userData.role
                        }));

                        // Show success toast for session restoration
                        showSuccessToast('Welcome back! Session restored');
                    } else {
                        // Invalid response format
                        handleUnauthorizedAccess('invalid_token');
                    }
                } catch (error: any) {
                    console.error('Failed to fetch user data:', error);

                    // If API call fails (401, 403, network error, etc.), handle accordingly
                    if (error.response?.status === 401) {
                        handleUnauthorizedAccess('token_expired');
                    } else if (error.response?.status === 403) {
                        handleUnauthorizedAccess('invalid_token');
                    } else {
                        handleUnauthorizedAccess();
                    }
                } finally {
                    dispatch(setLoading(false));
                }
                return;
            }

            // If we have both token and user, we're already authenticated
            // No need to set loading to false here as it should already be false
        };

        // Only run auth check if we don't have a user yet
        if (!user) {
            initializeAuth();
        }
    }, [user, navigate, dispatch]);

    // Show loading screen during Redux loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    {/* Loading Animation */}
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-800">HealthHub</h2>
                        <p className="text-lg text-gray-600">Loading your dashboard...</p>
                        <div className="flex items-center justify-center space-x-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 max-w-md mx-auto">
                        <p className="text-sm text-gray-600">
                            Verifying your authentication and preparing your workspace...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // If user is not authenticated, useEffect will handle redirect
    if (!user) {
        return null;
    }

    // Check if user has required role
    if (requiredRole && !hasRequiredRole(user.role, requiredRole)) {
        // User doesn't have required role, redirect to login
        handleUnauthorizedAccess('insufficient_role');
        return null;
    }

    // User is authenticated and has required role, render the protected content
    return <>{children}</>;
};

export default Protected;
