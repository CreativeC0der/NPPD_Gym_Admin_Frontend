import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Search, UserPlus, Ban, MoreVertical, Mail, Phone, Clock } from 'lucide-react';
import axios from '@/axios/axios-config';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    age?: number;
    aadharNumber?: string;
    abhaId?: string;
    consent?: boolean;
    privacyNoticeAccepted?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    oauthProvider?: string;
    role: 'user' | 'admin' | 'superadmin' | 'consultant';
    status?: 'active' | 'pending' | 'banned';
    gym?: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    lastActive?: string;
    // Stats
    sessions?: number;
    healthScore?: number;
    engagement?: number;
    rating?: number;
}

interface ApiResponse {
    success: boolean;
    data: User[];
    pagination: {
        total: number;
        page: string;
        limit: string;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface UserStats {
    totalUsers: number;
    activeUsers: number;
    pendingApproval: number;
    gymAdmins: number;
    bannedUsers: number;
}

const ViewAllUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        activeUsers: 0,
        pendingApproval: 0,
        gymAdmins: 0,
        bannedUsers: 0,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, statusFilter, roleFilter, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Fetch actual data from API
            const response = await axios.get<ApiResponse>('/auth/users?role=user&page=1&limit=100&sortBy=createdAt&sortOrder=desc');

            if (response?.data?.success) {
                const userData = response.data.data ?? [];

                // Add mock statistics for demonstration (these would ideally come from backend)
                const usersWithStats: User[] = userData.map((user: User) => ({
                    ...user,
                    // Determine status based on email/phone verification
                    status: (user?.emailVerified && user?.phoneVerified ? 'active' :
                        (!user?.emailVerified || !user?.phoneVerified) ? 'pending' : 'active') as 'active' | 'pending' | 'banned',
                    // Add mock stats
                    sessions: Math.floor(Math.random() * 150) + 1,
                    healthScore: Math.floor(Math.random() * 30) + 70,
                    engagement: Math.floor(Math.random() * 40) + 60,
                    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
                    // Add last active time (mock)
                    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                }));

                setUsers(usersWithStats);
                calculateStats(usersWithStats);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorToast('Failed to load users');
            setUsers([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (userData: User[]) => {
        const safeUserData = userData ?? [];
        setStats({
            totalUsers: safeUserData.length,
            activeUsers: safeUserData.filter(u => u?.status === 'active').length,
            pendingApproval: safeUserData.filter(u => u?.status === 'pending').length,
            gymAdmins: safeUserData.filter(u => u?.role === 'admin').length,
            bannedUsers: safeUserData.filter(u => u?.status === 'banned').length,
        });
    };

    const filterUsers = () => {
        let filtered = [...(users ?? [])];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (user) =>
                    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((user) => user?.status === statusFilter);
        }

        // Apply role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter((user) => user?.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const getInitials = (name: string) => {
        const safeName = name ?? 'Unknown';
        return safeName
            .split(' ')
            .map(n => n?.[0] ?? '')
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    const getStatusBadge = (status: string) => {
        const safeStatus = status ?? 'active';
        switch (safeStatus) {
            case 'active':
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                        Active
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20">
                        Pending
                    </Badge>
                );
            case 'banned':
                return (
                    <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
                        Banned
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                        Active
                    </Badge>
                );
        }
    };

    const getRoleBadge = (role: string) => {
        const safeRole = role ?? 'user';
        switch (safeRole) {
            case 'user':
                return (
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        User
                    </Badge>
                );
            case 'admin':
                return (
                    <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Admin
                    </Badge>
                );
            case 'superadmin':
                return (
                    <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        Super Admin
                    </Badge>
                );
            case 'consultant':
                return (
                    <Badge className="bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        Consultant
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        User
                    </Badge>
                );
        }
    };

    const formatTimeAgo = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) {
                const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                if (diffInHours === 0) {
                    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                    return `${diffInMinutes}m ago`;
                }
                return `${diffInHours}h ago`;
            }
            return `${diffInDays}d ago`;
        } catch (error) {
            return 'N/A';
        }
    };

    const handleUserAction = (action: string, userId: string) => {
        console.log(`${action} user:`, userId);
        showSuccessToast(`User ${action} successfully`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-slate-400">Manage platform users, permissions, and account status</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Pending Approval ({stats?.pendingApproval ?? 0})
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    >
                        <Ban className="w-4 h-4 mr-2" />
                        Banned Users ({stats?.bannedUsers ?? 0})
                    </Button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search users by name or email..."
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
                        <SelectItem value="banned" className="text-white">Banned</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-[180px] bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white">All Roles</SelectItem>
                        <SelectItem value="user" className="text-white">User</SelectItem>
                        <SelectItem value="admin" className="text-white">Admin</SelectItem>
                        <SelectItem value="consultant" className="text-white">Consultant</SelectItem>
                        <SelectItem value="superadmin" className="text-white">Super Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-blue-500 mb-2">{stats?.totalUsers ?? 0}</div>
                    <div className="text-slate-400 text-sm">Total Users</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-green-500 mb-2">{stats?.activeUsers ?? 0}</div>
                    <div className="text-slate-400 text-sm">Active Users</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">{stats?.pendingApproval ?? 0}</div>
                    <div className="text-slate-400 text-sm">Pending Approval</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-purple-500 mb-2">{stats?.gymAdmins ?? 0}</div>
                    <div className="text-slate-400 text-sm">Gym Admins</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-4xl font-bold text-red-500 mb-2">{stats?.bannedUsers ?? 0}</div>
                    <div className="text-slate-400 text-sm">Banned Users</div>
                </div>
            </div>

            {/* User Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">Loading users...</div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">No users found</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredUsers.map((user) => (
                        <div
                            key={user?._id ?? Math.random()}
                            className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Avatar */}
                                    <Avatar className="w-16 h-16 bg-slate-700">
                                        <AvatarFallback className="bg-slate-700 text-white text-lg font-semibold">
                                            {getInitials(user?.name ?? 'Unknown')}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2">{user?.name ?? 'Unknown User'}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {user?.email ?? 'No email'}
                                            </div>
                                            {user?.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {user.phone}
                                                </div>
                                            )}
                                            {user?.lastActive && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTimeAgo(user.lastActive)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            {getStatusBadge(user?.status ?? 'active')}
                                            {getRoleBadge(user?.role ?? 'user')}
                                            {user?.gym?.name && (
                                                <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                                                    {user.gym.name}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-4 gap-6">
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.sessions ?? 0}</div>
                                                <div className="text-sm text-slate-400">Sessions</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.healthScore ?? 0}</div>
                                                <div className="text-sm text-slate-400">Health Score</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.engagement ?? 0}%</div>
                                                <div className="text-sm text-slate-400">Engagement</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.rating ?? 0}</div>
                                                <div className="text-sm text-slate-400">Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
                                        <DropdownMenuItem
                                            className="hover:bg-slate-800"
                                            onClick={() => handleUserAction('View', user?._id ?? '')}
                                        >
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="hover:bg-slate-800"
                                            onClick={() => handleUserAction('Edit', user?._id ?? '')}
                                        >
                                            Edit User
                                        </DropdownMenuItem>
                                        {user?.status === 'pending' && (
                                            <DropdownMenuItem
                                                className="hover:bg-slate-800"
                                                onClick={() => handleUserAction('Approve', user?._id ?? '')}
                                            >
                                                Approve User
                                            </DropdownMenuItem>
                                        )}
                                        {user?.status !== 'banned' && (
                                            <DropdownMenuItem
                                                className="hover:bg-slate-800 text-red-400"
                                                onClick={() => handleUserAction('Ban', user?._id ?? '')}
                                            >
                                                Ban User
                                            </DropdownMenuItem>
                                        )}
                                        {user?.status === 'banned' && (
                                            <DropdownMenuItem
                                                className="hover:bg-slate-800 text-green-400"
                                                onClick={() => handleUserAction('Unban', user?._id ?? '')}
                                            >
                                                Unban User
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewAllUsers;
