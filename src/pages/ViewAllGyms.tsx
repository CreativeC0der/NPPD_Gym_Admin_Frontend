import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, BarChart3, Plus, MoreVertical, Eye, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '@/axios/axios-config';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

interface Gym {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    subscriptionPlan?: string;
    admin: {
        _id: string;
        name: string;
        email: string;
    };
    gymId: string;
    createdAt: string;
    amenities?: string[];
    price?: number;
    rating?: number;
    // Stats (these would come from actual API)
    totalUsers?: number;
    activeUsers?: number;
    monthlyRevenue?: number;
    consultants?: number;
    utilization?: number;
    satisfaction?: number;
}

interface GymStats {
    totalGyms: number;
    activeGyms: number;
    pendingApproval: number;
    monthlyRevenue: number;
}

const ViewAllGyms: React.FC = () => {
    const navigate = useNavigate();
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<GymStats>({
        totalGyms: 0,
        activeGyms: 0,
        pendingApproval: 0,
        monthlyRevenue: 0,
    });

    useEffect(() => {
        fetchGyms();
    }, []);

    useEffect(() => {
        filterGyms();
    }, [searchQuery, statusFilter, gyms]);

    const fetchGyms = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/gyms');
            const gymData = response?.data ?? [];

            // Add mock statistics for demonstration
            const gymsWithStats = gymData.map((gym: Gym) => ({
                ...gym,
                totalUsers: Math.floor(Math.random() * 3000) + 1000,
                activeUsers: Math.floor(Math.random() * 2500) + 500,
                monthlyRevenue: Math.floor(Math.random() * 100) + 50,
                consultants: Math.floor(Math.random() * 15) + 5,
                utilization: Math.floor(Math.random() * 30) + 70,
                satisfaction: (Math.random() * 1.5 + 3.5).toFixed(1),
            }));

            setGyms(gymsWithStats);
            calculateStats(gymsWithStats);
        } catch (error) {
            console.error('Error fetching gyms:', error);
            showErrorToast('Failed to load gyms');
            setGyms([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (gymData: Gym[]) => {
        const safeGymData = gymData ?? [];
        const totalRevenue = safeGymData.reduce((sum, gym) => sum + (gym?.monthlyRevenue ?? 0), 0);
        setStats({
            totalGyms: safeGymData.length,
            activeGyms: safeGymData.filter(g => g?.subscriptionPlan).length,
            pendingApproval: Math.floor(safeGymData.length * 0.1), // Mock data
            monthlyRevenue: totalRevenue,
        });
    };

    const filterGyms = () => {
        let filtered = [...(gyms ?? [])];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (gym) =>
                    gym?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    gym?.address?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'active') {
                filtered = filtered.filter((gym) => gym?.subscriptionPlan);
            } else if (statusFilter === 'pending') {
                filtered = filtered.filter((gym) => !gym?.subscriptionPlan);
            }
        }

        setFilteredGyms(filtered);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const formatRevenue = (amount: number) => {
        const safeAmount = amount ?? 0;
        if (safeAmount >= 1000) {
            return `$${(safeAmount / 1000).toFixed(0)}k`;
        }
        return `$${safeAmount}`;
    };

    const getGymIcon = () => {
        return (
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                </svg>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Gym Management</h1>
                <p className="text-slate-400">Manage gym locations, owners, and performance metrics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-blue-500 mb-2">{stats?.totalGyms ?? 0}</div>
                    <div className="text-slate-400 text-sm">Total Gyms</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-green-500 mb-2">{stats?.activeGyms ?? 0}</div>
                    <div className="text-slate-400 text-sm">Active Gyms</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">{stats?.pendingApproval ?? 0}</div>
                    <div className="text-slate-400 text-sm">Pending Approval</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-purple-500 mb-2">
                        ${((stats?.monthlyRevenue ?? 0) / 1000).toFixed(0)}k
                    </div>
                    <div className="text-slate-400 text-sm">Monthly Subscription Revenue</div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search gyms by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px] bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white">All Status</SelectItem>
                        <SelectItem value="active" className="text-white">Active</SelectItem>
                        <SelectItem value="pending" className="text-white">Pending</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                </Button>
                <Button
                    onClick={() => navigate('/gyms/create')}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Gym
                </Button>
            </div>

            {/* Gym Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">Loading gyms...</div>
                </div>
            ) : filteredGyms.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">No gyms found</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredGyms.map((gym) => (
                        <div
                            key={gym?._id ?? Math.random()}
                            className="bg-slate-900 rounded-lg border border-slate-800 p-6 hover:border-slate-700 transition-colors"
                        >
                            {/* Gym Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    {getGymIcon()}
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{gym?.name ?? 'Unknown Gym'}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {gym?.address?.split(',')[1] ?? gym?.address ?? 'Location'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {gym?.email ?? 'No email'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                {gym?.phone ?? 'No phone'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                        Active
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-white"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-slate-900 border-slate-700">
                                            <DropdownMenuItem className="text-white hover:bg-slate-800">
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-white hover:bg-slate-800">
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500 hover:bg-slate-800">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Gym Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {gym?.totalUsers?.toLocaleString() ?? 0}
                                    </div>
                                    <div className="text-xs text-slate-400">Total Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-500 mb-1">
                                        {gym?.activeUsers?.toLocaleString() ?? 0}
                                    </div>
                                    <div className="text-xs text-slate-400">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {formatRevenue(gym?.monthlyRevenue ?? 0)}
                                    </div>
                                    <div className="text-xs text-slate-400">Monthly Revenue</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {gym?.consultants ?? 0}
                                    </div>
                                    <div className="text-xs text-slate-400">Consultants</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {gym?.utilization ?? 0}%
                                    </div>
                                    <div className="text-xs text-slate-400">Utilization</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {gym?.satisfaction ?? 'N/A'}
                                    </div>
                                    <div className="text-xs text-slate-400">Satisfaction</div>
                                </div>
                            </div>

                            {/* Gym Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div className="flex items-center gap-6 text-sm text-slate-400">
                                    <div>
                                        <span className="font-semibold text-white">Owner:</span> {gym?.admin?.name ?? 'Unknown'}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white">Plan:</span>{' '}
                                        {gym?.subscriptionPlan ? (
                                            <span className="capitalize">{gym.subscriptionPlan}</span>
                                        ) : (
                                            <span className="text-yellow-500">Pending</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white">Created:</span>{' '}
                                        {formatDate(gym?.createdAt ?? '')}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                                    onClick={() => {
                                        // Navigate to gym details page
                                        showSuccessToast('Viewing gym details');
                                    }}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewAllGyms;
