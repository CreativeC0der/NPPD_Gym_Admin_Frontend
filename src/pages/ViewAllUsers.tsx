import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Mail, Phone, Clock } from 'lucide-react';
import axios from '@/axios/axios-config';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import type User from "../types/User";
import Pagination from '@/components/Pagination';
import UserDetailDialog from '@/components/UserDetailDialog';

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

const ViewAllUsers: React.FC = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState(''); // used for API
    const [searchInput, setSearchInput] = useState(''); // used for input field
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const PAGE_LIMIT = 5;

    useEffect(() => {
        fetchUsers(page, searchQuery);
    }, [page, searchQuery]);

    // Remove setFilteredUsers and filteredUsers
    // Only filter by status and role locally, not by searchQuery
    const getLocallyFilteredUsers = () => {
        let filtered = [...(users ?? [])];
        return filtered;
    };

    const fetchUsers = async (pageNum = 1, name = '') => {
        try {
            setLoading(true);
            // Fetch actual data from API
            let url = `/auth/users?role=user&page=${pageNum}&limit=${PAGE_LIMIT}&sortBy=createdAt&sortOrder=desc`;
            if (name) {
                url += `&name=${encodeURIComponent(name)}`;
            }
            const response = await axios.get<ApiResponse>(url);

            if (response?.data?.success) {
                const userData = response.data.data ?? [];
                setUsers(userData);
                setTotalPages(response.data.pagination.totalPages || 1);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorToast('Failed to load users');
            setUsers([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
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


    const handleUserAction = (action: string, userId: string) => {
        if (action === 'View') {
            const user = users.find(u => u._id === userId);
            setSelectedUser(user || null);
            setDialogOpen(true);
            return;
        }
        console.log(`${action} user:`, userId);
        showSuccessToast(`User ${action} successfully`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6">
            {/* User Details Dialog */}
            <UserDetailDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={selectedUser}
                getInitials={getInitials}
                getStatusBadge={getStatusBadge}
            />
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-slate-400">Manage platform users, permissions, and account status</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearchQuery(searchInput);
                                setPage(1); // Reset to first page on new search
                            }
                        }}
                        className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                    />
                </div>

            </div>

            {/* User Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">Loading users...</div>
                </div>
            ) : getLocallyFilteredUsers().length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-slate-400">No users found</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {getLocallyFilteredUsers().map((user: User) => (
                        <div
                            key={user?._id ?? Math.random()}
                            className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Avatar */}
                                    <Avatar className="w-16 h-16 bg-slate-700">
                                        <AvatarFallback className="bg-slate-700 text-white text-lg font-semibold">
                                            {getInitials(user?.profile?.fullName ?? user?.name ?? 'Unknown')}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2">{user?.profile?.fullName ?? user?.name ?? 'Unknown User'}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {user?.profile?.email ?? user?.email ?? 'No email'}
                                            </div>
                                            {user?.profile?.phone || user?.phone ? (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {user?.profile?.phone ?? user?.phone}
                                                </div>
                                            ) : null}
                                            {user?.createdAt && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            {getStatusBadge(user?.emailVerified && user?.phoneVerified ? 'active' : (!user?.emailVerified || !user?.phoneVerified) ? 'pending' : 'active')}
                                            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                User
                                            </Badge>
                                            {user?.profile?.membershipStatus && (
                                                <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                                                    {user.profile.membershipStatus.charAt(0).toUpperCase() + user.profile.membershipStatus.slice(1)}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Relevant Details */}
                                        <div className="grid grid-cols-4 gap-6">
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.profile?.healthMetrics?.age ?? user?.age ?? '-'}</div>
                                                <div className="text-sm text-slate-400">Age</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.profile?.healthMetrics?.gender ?? '-'}</div>
                                                <div className="text-sm text-slate-400">Gender</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.profile?.healthMetrics?.fitnessGoal?.replace('_', ' ') ?? '-'}</div>
                                                <div className="text-sm text-slate-400">Fitness Goal</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white">{user?.profile?.subscriptionType ?? '-'}</div>
                                                <div className="text-sm text-slate-400">Subscription</div>
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

            {/* Pagination */}
            {!loading && getLocallyFilteredUsers().length > 0 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    className="mt-8"
                />
            )}
        </div>
    );
};

export default ViewAllUsers;
