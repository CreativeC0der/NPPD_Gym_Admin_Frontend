import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { clearUser } from '../store/slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { showConfirmDialog, showSuccessToast, showErrorToast } from '../utils/toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '../components/ui/dialog';
import CreateAdminForm from '../components/CreateAdminForm';
import DashboardMetrics, { type DashboardMetricsData } from '../components/DashboardMetrics';
import { UserRevenueChart } from '../components/UserRevenueChart';
import { TopPerformingGyms } from '../components/TopPerformingGyms';
import api from '../axios/axios-config';
import { RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchDashboardMetrics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/metrics/kpi');
            console.log((response.data));

            setMetrics(response.data);
            setLastUpdated(new Date());
        } catch (error: any) {
            console.error('Error fetching dashboard metrics:', error);
            showErrorToast(error.response?.data?.message || 'Failed to load dashboard metrics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardMetrics();
    }, []);

    const handleRefresh = () => {
        fetchDashboardMetrics();
        showSuccessToast('Dashboard refreshed');
    };

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

    // Protected component ensures user exists, but add safety check for TypeScript
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            {/* Header */}
            <div className="bg-[#1f2937] shadow-lg border-b border-slate-700">
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
                            className="text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            style={{ backgroundColor: 'var(--accent-blue)' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-3xl font-bold text-white">Platform Overview</h2>
                            <p className="text-slate-400 mt-1">Comprehensive platform monitoring and management dashboard</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {user.role === 'superadmin' && (
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            className="px-4 py-2 rounded-lg transition-colors text-white font-medium"
                                            style={{ backgroundColor: 'var(--accent-green)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            + Create Admin
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
                            )}
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics Cards */}
                <DashboardMetrics metrics={metrics} loading={loading} />

                {/* Growth Trends Chart and Top Performing Gyms */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UserRevenueChart />
                    <TopPerformingGyms />
                </div>

                {/* Additional Info Banner */}
                <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-blue-200 text-sm font-medium">
                                You have {user.role === 'superadmin' ? 'full system access' : 'administrative privileges'} to manage the gym administration system.
                            </p>
                            <p className="text-blue-300/70 text-xs mt-1">
                                Last updated: {lastUpdated.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
