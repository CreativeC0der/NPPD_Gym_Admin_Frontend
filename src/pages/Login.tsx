import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios/axios-config';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setUser, setLoading } from '../store/slices/UserSlice';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Admin');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        dispatch(setLoading(true));

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            const { userId, name, email: userEmail, phone, role, token } = response.data;

            // Store token in localStorage
            localStorage.setItem('token', token);

            // Set user data in Redux store
            dispatch(setUser({
                userId,
                name,
                email: userEmail,
                phone,
                role
            }));

            // Show success toast
            showSuccessToast(`Welcome back, ${name}!`);

            // Navigate to dashboard on successful login
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);

            let errorMessage = 'An unexpected error occurred. Please try again.';

            // Handle different error scenarios
            if (err.response?.status === 401) {
                errorMessage = 'Invalid email or password';
            } else if (err.response?.status === 400) {
                errorMessage = 'Please provide valid email and password';
            } else if (err.code === 'NETWORK_ERROR' || !err.response) {
                errorMessage = 'Unable to connect to server. Please try again later.';
            }

            setError(errorMessage);
            showErrorToast(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Logo and Header */}
                <div className="login-logo-container">
                    <div className="login-logo">
                        <svg className="login-logo-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                    <h1 className="login-title">
                        HealthHub
                    </h1>
                    <p className="login-subtitle">
                        Your wellness companion
                    </p>
                </div>

                {/* Login Form */}
                <div className="login-form-container">
                    <div className="login-welcome-section">
                        <h2 className="login-welcome-title">Welcome back</h2>
                        <p className="login-welcome-text">Sign in to your account to continue</p>
                    </div>

                    {/* User Type Tabs */}
                    <div className="user-type-tabs">
                        {['Admin', 'Superadmin'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setUserType(type)}
                                className={`user-type-tab ${userType === type
                                    ? 'user-type-tab-active'
                                    : 'user-type-tab-inactive'
                                    }`}
                            >
                                {type === 'Admin' && (
                                    <span style={{ marginRight: '0.25rem' }}>👑</span>
                                )}
                                {type === 'Superadmin' && (
                                    <span style={{ marginRight: '0.25rem' }}>⚡</span>
                                )}
                                {type}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message" style={{
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                padding: '0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #fecaca',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={isLoading}
                            style={{
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <span style={{ marginRight: '0.5rem' }}>⏳</span>
                                    Signing in...
                                </>
                            ) : (
                                `Sign in as ${userType === 'Superadmin' ? 'Super Admin' : 'Executive Admin'}`
                            )}
                        </button>
                    </form>

                    <div className="demo-credentials-note">
                        <p className="demo-credentials-text">
                            Enter your credentials to sign in to the admin panel
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
