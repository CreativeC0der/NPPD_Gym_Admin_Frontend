import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { clearUser } from '../store/slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { showConfirmDialog, showSuccessToast, showInfoToast } from '../utils/toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '../components/ui/dialog';
import CreateAdminForm from '../components/CreateAdminForm';

const Dashboard: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleLogout = async () => {
        const confirmed = await showConfirmDialog(
            'Confirm Logout',
            'Are you sure you want to logout?',
            'Yes, Logout',
            'Cancel'
        );

        if (confirmed) {
            // Clear user from Redux store
            dispatch(clearUser());
            // Remove token from localStorage
            localStorage.removeItem('token');
            // Show success toast
            showSuccessToast('Successfully logged out');
            // Navigate to login page
            navigate('/');
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return '👑';
            case 'superadmin':
                return '⚡';
            case 'consultant':
                return '🩺';
            case 'user':
                return '👤';
            default:
                return '👤';
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Executive Admin';
            case 'superadmin':
                return 'Super Admin';
            case 'consultant':
                return 'Consultant';
            case 'user':
                return 'User';
            default:
                return 'User';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-blue-900 text-blue-300 border border-blue-700';
            case 'superadmin':
                return 'bg-purple-900 text-purple-300 border border-purple-700';
            case 'consultant':
                return 'bg-green-900 text-green-300 border border-green-700';
            case 'user':
                return 'bg-slate-700 text-slate-300 border border-slate-600';
            default:
                return 'bg-slate-700 text-slate-300 border border-slate-600';
        }
    };

    const handleQuickAction = (actionName: string) => {
        showInfoToast(`${actionName} feature coming soon!`);
    };

    // Protected component ensures user exists, but add safety check for TypeScript
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <div className="bg-slate-900 shadow-sm border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <svg className="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <h1 className="text-xl font-bold text-white">HealthHub Admin</h1>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="text-4xl">
                            {getRoleIcon(user.role)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Welcome back, {user.name}!
                            </h2>
                            <p className="text-slate-400">
                                You're logged in as {getRoleDisplayName(user.role)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Details Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">User Information</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                <span className="text-slate-400 font-medium">User ID:</span>
                                <span className="text-white font-mono text-sm">{user.userId}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                <span className="text-slate-400 font-medium">Name:</span>
                                <span className="text-white">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                <span className="text-slate-400 font-medium">Email:</span>
                                <span className="text-white">{user.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                <span className="text-slate-400 font-medium">Phone:</span>
                                <span className="text-white">{user.phone}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-400 font-medium">Role:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                                    {getRoleIcon(user.role)} {getRoleDisplayName(user.role)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats or Actions */}
                    <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {/* Create Admin User Dialog */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <button className="w-full text-left p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">➕</span>
                                            <span className="text-white font-medium">Create Admin User</span>
                                        </div>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Create Admin User</DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Fill in the details below to create a new admin user. All fields are required.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <CreateAdminForm
                                        onClose={() => setIsDialogOpen(false)}
                                        onSuccess={() => setIsDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                            <button
                                onClick={() => handleQuickAction('Manage Users')}
                                className="w-full text-left p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">👥</span>
                                    <span className="text-white font-medium">Manage Users</span>
                                </div>
                            </button>
                            <button
                                onClick={() => handleQuickAction('System Settings')}
                                className="w-full text-left p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">⚙️</span>
                                    <span className="text-white font-medium">System Settings</span>
                                </div>
                            </button>
                            <button
                                onClick={() => handleQuickAction('View Reports')}
                                className="w-full text-left p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">📊</span>
                                    <span className="text-white font-medium">View Reports</span>
                                </div>
                            </button>
                            <button
                                onClick={() => handleQuickAction('Gym Management')}
                                className="w-full text-left p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">🏥</span>
                                    <span className="text-white font-medium">Gym Management</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-blue-200 text-sm">
                            You have {user.role === 'superadmin' ? 'full system access' : 'administrative privileges'} to manage the gym administration system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
